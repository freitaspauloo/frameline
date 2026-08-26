"use client";

import { RiFileTextLine } from "@remixicon/react";

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContainer,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockHeader,
} from "@/components/ai-elements/code-block";
import {
  Commit,
  CommitAuthor,
  CommitAuthorAvatar,
  CommitContent,
  CommitFile,
  CommitFileAdditions,
  CommitFileChanges,
  CommitFileDeletions,
  CommitFileInfo,
  CommitFilePath,
  CommitFiles,
  CommitFileStatus,
  CommitHash,
  CommitHeader,
  CommitInfo,
  CommitMessage,
  CommitMetadata,
  CommitSeparator,
  CommitTimestamp,
} from "@/components/ai-elements/commit";
import {
  EnvironmentVariable,
  EnvironmentVariableCopyButton,
  EnvironmentVariableGroup,
  EnvironmentVariableName,
  EnvironmentVariableRequired,
  EnvironmentVariables,
  EnvironmentVariablesContent,
  EnvironmentVariablesHeader,
  EnvironmentVariablesTitle,
  EnvironmentVariablesToggle,
  EnvironmentVariableValue,
} from "@/components/ai-elements/environment-variables";
import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
  FileTreeName,
} from "@/components/ai-elements/file-tree";
import {
  PackageInfo,
  PackageInfoContent,
  PackageInfoDependencies,
  PackageInfoDependency,
  PackageInfoDescription,
} from "@/components/ai-elements/package-info";
import {
  Sandbox,
  SandboxContent,
  SandboxHeader,
  SandboxTabContent,
  SandboxTabs,
  SandboxTabsBar,
  SandboxTabsList,
  SandboxTabsTrigger,
} from "@/components/ai-elements/sandbox";
import { SchemaDisplay } from "@/components/ai-elements/schema-display";
import {
  Snippet,
  SnippetCopyButton,
  SnippetText,
} from "@/components/ai-elements/snippet";
import {
  StackTrace,
  StackTraceActions,
  StackTraceCopyButton,
  StackTraceContent,
  StackTraceError,
  StackTraceErrorMessage,
  StackTraceErrorType,
  StackTraceFrames,
  StackTraceHeader,
} from "@/components/ai-elements/stack-trace";
import { Terminal } from "@/components/ai-elements/terminal";
import {
  Test,
  TestResults,
  TestResultsContent,
  TestResultsDuration,
  TestResultsHeader,
  TestResultsProgress,
  TestResultsSummary,
  TestSuite,
  TestSuiteContent,
  TestSuiteName,
  TestSuiteStats,
} from "@/components/ai-elements/test-results";

import {
  MOCK_CODE_CSS,
  MOCK_CODE_TSX,
  MOCK_ENV_VARS,
  MOCK_FILE_TREE,
  MOCK_STACK_TRACE,
  MOCK_TERMINAL_OUTPUT,
} from "../../_lib/mock-data";
import { KitBlock, KitSection } from "../kit-block";

const SCHEMA_PARAMETERS = [
  { description: "Screen slug", name: "slug", required: true, type: "string" },
  {
    description: "Capture viewport",
    name: "viewport",
    required: false,
    type: "string",
  },
];

const SCHEMA_RESPONSE = [
  { name: "path", type: "string" },
  { name: "bytes", type: "number" },
  { name: "capturedAt", type: "string" },
];

export function DevBlocks() {
  return (
    <KitSection
      description="The blocks that make an agent legible to a developer: highlighted code, a shell, a file tree, a sandbox, plus the diagnostics — stack traces, test runs, dependency and schema cards."
      eyebrow="ai-elements"
      id="dev"
      title="Code, shells & diagnostics"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <KitBlock
          bodyClassName="p-0"
          note="Shiki highlights client-side. Copy button included."
          source="ai-elements/code-block"
          title="Code block"
        >
          <CodeBlockContainer className="rounded-none border-0" language="tsx">
            <CodeBlockHeader>
              <CodeBlockFilename>
                src/screens/hero-dither/screen.tsx
              </CodeBlockFilename>
              <CodeBlockActions>
                <CodeBlockCopyButton />
              </CodeBlockActions>
            </CodeBlockHeader>
            <CodeBlockContent
              code={MOCK_CODE_TSX}
              language="tsx"
              showLineNumbers
            />
          </CodeBlockContainer>
        </KitBlock>

        <KitBlock
          bodyClassName="p-0"
          note="Shorthand form — one prop per code fence."
          source="ai-elements/code-block"
          title="Code block, shorthand"
        >
          <CodeBlock
            className="rounded-none border-0"
            code={MOCK_CODE_CSS}
            language="css"
          />
        </KitBlock>

        <KitBlock source="ai-elements/snippet" title="Snippet">
          <Snippet code="pnpm posters hero-dither">
            <SnippetText>pnpm posters hero-dither</SnippetText>
            <SnippetCopyButton />
          </Snippet>
        </KitBlock>

        <KitBlock
          bodyClassName="p-0"
          note="ANSI-aware. The output is a string constant."
          source="ai-elements/terminal"
          title="Terminal"
        >
          <Terminal
            className="rounded-none border-0"
            output={MOCK_TERMINAL_OUTPUT}
          />
        </KitBlock>

        <KitBlock source="ai-elements/file-tree" title="File tree">
          <FileTree
            defaultExpanded={new Set([MOCK_FILE_TREE.folder])}
            selectedPath={`${MOCK_FILE_TREE.folder}/screen.tsx`}
          >
            <FileTreeFolder
              name={MOCK_FILE_TREE.folder}
              path={MOCK_FILE_TREE.folder}
            >
              {MOCK_FILE_TREE.files.map((file) => (
                <FileTreeFile
                  icon={<RiFileTextLine className="size-3.5" />}
                  key={file}
                  name={file}
                  path={`${MOCK_FILE_TREE.folder}/${file}`}
                >
                  <FileTreeName>{file}</FileTreeName>
                </FileTreeFile>
              ))}
            </FileTreeFolder>
          </FileTree>
        </KitBlock>

        <KitBlock
          bodyClassName="p-0"
          source="ai-elements/sandbox"
          title="Sandbox"
        >
          <Sandbox className="mb-0 rounded-none border-0">
            <SandboxHeader state="input-available" title="sbx_hero_dither" />
            <SandboxContent>
              <SandboxTabs defaultValue="logs">
                <SandboxTabsBar>
                  <SandboxTabsList>
                    <SandboxTabsTrigger value="logs">Logs</SandboxTabsTrigger>
                    <SandboxTabsTrigger value="files">Files</SandboxTabsTrigger>
                  </SandboxTabsList>
                </SandboxTabsBar>
                <SandboxTabContent className="p-4" value="logs">
                  <pre className="overflow-x-auto font-mono text-muted-foreground text-xs">
                    {MOCK_TERMINAL_OUTPUT}
                  </pre>
                </SandboxTabContent>
                <SandboxTabContent className="p-4" value="files">
                  <ul className="flex flex-col gap-1 font-mono text-muted-foreground text-xs">
                    {MOCK_FILE_TREE.files.map((file) => (
                      <li key={file}>
                        {MOCK_FILE_TREE.folder}/{file}
                      </li>
                    ))}
                  </ul>
                </SandboxTabContent>
              </SandboxTabs>
            </SandboxContent>
          </Sandbox>
        </KitBlock>

        <KitBlock source="ai-elements/stack-trace" title="Stack trace">
          <StackTrace defaultOpen trace={MOCK_STACK_TRACE}>
            <StackTraceHeader>
              <StackTraceError>
                <StackTraceErrorType />
                <StackTraceErrorMessage />
              </StackTraceError>
              <StackTraceActions>
                <StackTraceCopyButton />
              </StackTraceActions>
            </StackTraceHeader>
            <StackTraceContent>
              <StackTraceFrames />
            </StackTraceContent>
          </StackTrace>
        </KitBlock>

        <KitBlock source="ai-elements/test-results" title="Test results">
          <TestResults
            summary={{ duration: 4120, failed: 1, passed: 18, skipped: 2, total: 21 }}
          >
            <TestResultsHeader>
              <TestResultsSummary />
              <TestResultsDuration />
            </TestResultsHeader>
            <TestResultsProgress />
            <TestResultsContent>
              <TestSuite defaultOpen name="screens/stage" status="passed">
                <TestSuiteName />
                <TestSuiteStats passed={12} />
                <TestSuiteContent>
                  <Test duration={31} name="locks the plate to 1920×1080" status="passed" />
                  <Test duration={18} name="avoids 100dvh when embedded" status="passed" />
                </TestSuiteContent>
              </TestSuite>
              <TestSuite defaultOpen name="screens/posters" status="failed">
                <TestSuiteName />
                <TestSuiteStats failed={1} passed={6} skipped={2} />
                <TestSuiteContent>
                  <Test duration={402} name="captures every catalog slug" status="failed" />
                  <Test name="skips slugs without a stage" status="skipped" />
                </TestSuiteContent>
              </TestSuite>
            </TestResultsContent>
          </TestResults>
        </KitBlock>

        <KitBlock source="ai-elements/package-info" title="Package info">
          <PackageInfo
            changeType="minor"
            currentVersion="2.5.0"
            name="streamdown"
            newVersion="2.6.0"
          >
            <PackageInfoDescription>
              Markdown renderer used by the message and reasoning blocks.
            </PackageInfoDescription>
            <PackageInfoContent>
              <PackageInfoDependencies>
                <PackageInfoDependency name="@streamdown/code" version="1.1.1" />
                <PackageInfoDependency name="@streamdown/math" version="1.0.2" />
                <PackageInfoDependency name="shiki" version="4.4.3" />
              </PackageInfoDependencies>
            </PackageInfoContent>
          </PackageInfo>
        </KitBlock>

        <KitBlock
          source="ai-elements/environment-variables"
          title="Environment variables"
        >
          <EnvironmentVariables>
            <EnvironmentVariablesHeader>
              <EnvironmentVariablesTitle>
                Playground env
              </EnvironmentVariablesTitle>
              <EnvironmentVariablesToggle />
            </EnvironmentVariablesHeader>
            <EnvironmentVariablesContent>
              {MOCK_ENV_VARS.map((entry) => (
                <EnvironmentVariable
                  key={entry.name}
                  name={entry.name}
                  value={entry.value}
                >
                  <EnvironmentVariableGroup>
                    <EnvironmentVariableName />
                    {entry.required ? <EnvironmentVariableRequired /> : null}
                  </EnvironmentVariableGroup>
                  <EnvironmentVariableGroup>
                    <EnvironmentVariableValue />
                    <EnvironmentVariableCopyButton />
                  </EnvironmentVariableGroup>
                </EnvironmentVariable>
              ))}
            </EnvironmentVariablesContent>
          </EnvironmentVariables>
        </KitBlock>

        <KitBlock source="ai-elements/commit" title="Commit">
          <Commit defaultOpen>
            <CommitHeader>
              <CommitInfo>
                <CommitHash>4f2a1c9</CommitHash>
                <CommitMessage>
                  feat(screens): dither the hero plate
                </CommitMessage>
              </CommitInfo>
              <CommitMetadata>
                <CommitAuthor>
                  <CommitAuthorAvatar initials="PF" />
                  Paulo Freitas
                </CommitAuthor>
                <CommitSeparator />
                <CommitTimestamp date={new Date("2026-08-26T09:12:00Z")} />
              </CommitMetadata>
            </CommitHeader>
            <CommitContent>
              <CommitFiles>
                <CommitFile>
                  <CommitFileInfo>
                    <CommitFileStatus status="added" />
                    <CommitFilePath>
                      src/screens/hero-dither/screen.tsx
                    </CommitFilePath>
                  </CommitFileInfo>
                  <CommitFileChanges>
                    <CommitFileAdditions count={64} />
                    <CommitFileDeletions count={0} />
                  </CommitFileChanges>
                </CommitFile>
                <CommitFile>
                  <CommitFileInfo>
                    <CommitFileStatus status="modified" />
                    <CommitFilePath>src/screens/catalog.ts</CommitFilePath>
                  </CommitFileInfo>
                  <CommitFileChanges>
                    <CommitFileAdditions count={3} />
                    <CommitFileDeletions count={1} />
                  </CommitFileChanges>
                </CommitFile>
              </CommitFiles>
            </CommitContent>
          </Commit>
        </KitBlock>

        <KitBlock
          className="lg:col-span-2"
          source="ai-elements/schema-display"
          title="Schema display"
        >
          <SchemaDisplay
            description="Capture a poster for a screen slug."
            method="POST"
            parameters={SCHEMA_PARAMETERS}
            path="/api/posters/capture"
            responseBody={SCHEMA_RESPONSE}
          />
        </KitBlock>
      </div>
    </KitSection>
  );
}
