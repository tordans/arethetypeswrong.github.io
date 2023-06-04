import type ts from "typescript";

export interface Host {
  createPackageFS: (packageName: string, packageVersion?: string) => Promise<FS>;
  createPackageFSFromTarball: (tgz: Uint8Array) => Promise<FS>;
}

export interface FS {
  readFile: (path: string) => string;
  fileExists: (path: string) => boolean;
  directoryExists: (path: string) => boolean;
  listFiles: () => string[];
}

export interface TraceCollector {
  trace: (message: string) => void;
  read: () => string[];
}

export type SourceFileCache = Record<string, ts.SourceFile>;

export type ResolutionKind = "node10" | "node16-cjs" | "node16-esm" | "bundler";

export type EntrypointResolutions = Record<string, Record<ResolutionKind, EntrypointResolutionAnalysis>>;

export interface TypedAnalysis {
  packageName: string;
  packageVersion: string;
  containsTypes: true;
  entrypointResolutions: EntrypointResolutions;
}

export type SymbolTable = Record<string, Symbol>;

export interface Symbol {
  name: string;
  flags: ts.SymbolFlags;
  valueDeclarationRange: [number, number] | undefined;
}

export interface UntypedAnalysis {
  packageName: string;
  packageVersion: string;
  containsTypes: false;
}

export type Analysis = TypedAnalysis | UntypedAnalysis;

export interface EntrypointResolutionAnalysis {
  name: string;
  isWildcard?: boolean;
  resolution?: Resolution;
  implementationResolution?: Resolution;
  trace: string[];
}

export type ModuleKindReason = "extension" | "type" | "no:type";
export interface ModuleKind {
  detectedKind: ts.ModuleKind.ESNext | ts.ModuleKind.CommonJS;
  detectedReason: ModuleKindReason;
  reasonFileName: string;
  syntax: ts.ModuleKind.ESNext | ts.ModuleKind.CommonJS | undefined;
}

export interface Resolution {
  fileName: string;
  isTypeScript: boolean;
  isJson: boolean;
  moduleKind: ModuleKind | undefined;
  exports?: SymbolTable | false;
}

export type Failable<T> = { status: "error"; error: string } | { status: "success"; data: T };

export interface ParsedPackageSpec {
  packageName: string;
  version: string | undefined;
}

declare global {
  interface ImportMeta {
    env?: Record<string, {}>;
  }
}
