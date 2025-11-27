import Ajv, { type ErrorObject } from "ajv";

import schema from "./schema.json";
import { VizualniAdminConfig } from "./types";

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: "failing",
});

const validateFn = ajv.compile(schema);

export interface ValidationIssue {
  path: string;
  message: string;
  keyword?: string;
}

const formatErrors = (errors: ErrorObject[] | null | undefined): ValidationIssue[] => {
  if (!errors) {
    return [];
  }

  return errors.map((error) => {
    const pathSource = (error as { instancePath?: string; dataPath?: string }).instancePath
      ?? (error as { instancePath?: string; dataPath?: string }).dataPath
      ?? "(root)";

    return {
      path: pathSource,
      message: error.message ?? "Invalid value",
      keyword: error.keyword,
    };
  });
};

export const validateConfig = (
  input: unknown
): { valid: true; data: VizualniAdminConfig } | { valid: false; errors: ValidationIssue[] } => {
  const clonedInput = typeof structuredClone === "function" ? structuredClone(input) : JSON.parse(JSON.stringify(input));

  const valid = validateFn(clonedInput);
  if (valid) {
    return { valid: true, data: clonedInput as VizualniAdminConfig };
  }

  return { valid: false, errors: formatErrors(validateFn.errors) };
};
