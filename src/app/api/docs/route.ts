import { NextResponse } from "next/server";
import openApiSpec from "./openapi.json";

export function GET() {
  return NextResponse.json(openApiSpec);
}
