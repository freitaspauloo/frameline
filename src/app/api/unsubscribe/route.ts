import { NextResponse } from "next/server";

import {
  isValidEmail,
  unsubscribeNurture,
  verifyNurtureToken,
} from "@/lib/nurture";
import {
  clientIp,
  rateLimit,
  rateLimitResponse,
} from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

function redirectToPage(request: Request, params: URLSearchParams) {
  const url = new URL("/unsubscribe", request.url);
  url.search = params.toString();
  return NextResponse.redirect(url);
}

async function readEmailAndToken(
  request: Request,
): Promise<{ email: string; token: string }> {
  const url = new URL(request.url);
  let email = url.searchParams.get("email")?.trim().toLowerCase() ?? "";
  let token = url.searchParams.get("token")?.trim() ?? "";

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      const body = (await request.json()) as {
        email?: string;
        token?: string;
      };
      email = body.email?.trim().toLowerCase() || email;
      token = body.token?.trim() || token;
    } catch {
      // fall through
    }
  } else if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    try {
      const form = await request.formData();
      email =
        String(form.get("email") ?? "")
          .trim()
          .toLowerCase() || email;
      token = String(form.get("token") ?? "").trim() || token;
    } catch {
      // fall through
    }
  }

  return { email, token };
}

/** One-click (RFC 8058) and form posts. */
export async function POST(request: Request) {
  const limited = rateLimit(`unsubscribe:${clientIp(request)}`, {
    limit: 20,
  });
  if (!limited.ok) return rateLimitResponse(limited);

  const { email, token } = await readEmailAndToken(request);
  const wantsHtml = (request.headers.get("accept") ?? "").includes("text/html");

  if (!isValidEmail(email) || !token || !verifyNurtureToken(email, token)) {
    if (wantsHtml) {
      const params = new URLSearchParams({ error: "invalid" });
      return redirectToPage(request, params);
    }
    return NextResponse.json(
      { ok: false, error: "Invalid unsubscribe link" },
      { status: 400 },
    );
  }

  const result = await unsubscribeNurture(email);
  if (!result.ok) {
    if (wantsHtml) {
      return redirectToPage(
        request,
        new URLSearchParams({ email, error: "missing" }),
      );
    }
    return NextResponse.json(result, { status: 400 });
  }

  if (wantsHtml) {
    return redirectToPage(
      request,
      new URLSearchParams({ email, done: "1" }),
    );
  }

  return NextResponse.json({ ok: true, already: result.already ?? false });
}

/** Gmail one-click sometimes GETs. Send people to the confirm page. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = new URLSearchParams();
  const email = url.searchParams.get("email");
  const token = url.searchParams.get("token");
  if (email) params.set("email", email);
  if (token) params.set("token", token);
  return redirectToPage(request, params);
}
