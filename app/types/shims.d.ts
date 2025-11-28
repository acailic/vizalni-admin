declare module "inquirer" {
  const inquirer: any;
  export = inquirer;
}

declare module "table" {
  export function table(data: any[], options?: any): string;
}

declare module "gzip-size" {
  const gzipSize: { sync(input: Buffer | string): number };
  export default gzipSize;
}

declare module "@mui/material" {
  const content: any;
  export = content;
}

declare module "@mui/styles" {
  const content: any;
  export = content;
}

declare module "@mui/icons-material" {
  const content: any;
  export = content;
}

declare module "@mui/lab" {
  const content: any;
  export = content;
}

declare module "@mui/lab/themeAugmentation" {
  const content: any;
  export = content;
}

declare module "@mui/material/styles" {
  const content: any;
  export = content;
}

declare module "@mui/material/styles/createTypography" {
  const content: any;
  export = content;
}

declare module "@mui/material/styles/shadows" {
  const content: any;
  export = content;
}

declare module "@mui/material/Button" {
  const content: any;
  export = content;
}

declare module "@mui/material/InputBase" {
  const content: any;
  export = content;
}

declare module "@mui/material/Typography" {
  const content: any;
  export = content;
}

declare module "use-debounce" {
  export function useDebounce<T>(value: T, delay?: number): [T];
}
