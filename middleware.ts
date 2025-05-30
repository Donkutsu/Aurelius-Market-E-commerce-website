import { NextRequest, NextResponse } from "next/server"
import { isValidPassword } from "./lib/isValidPassword";


export async function middleware(req: NextRequest) {
  // Check if the user is authenticated using the updated isAuthenticated function
  if ((await isAuthenticated(req)) === false) {
    // If not authenticated, return an Unauthorized response
    return new NextResponse("Unauthorized", {
      status: 401, // HTTP 401 Unauthorized status
      headers: {
        "WWW-Authenticate": "Basic", // Indicate Basic authentication scheme
      },
    });
  }
  // If authenticated, continue to the next middleware or route handler
  return NextResponse.next();
}

// Function to check if the user is authenticated using Basic Auth
async function isAuthenticated(req: NextRequest) {
  // Get the Authorization header (case-insensitive)
  const authHeader =
    req.headers.get("authorization") || req.headers.get("Authorization");

  // If no Authorization header is present, return false
  if (authHeader === null) return false;

  // Split the header to get the base64 encoded credentials
  // Example: "Basic YWRtaW46cGFzc3dvcmQ="
  const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64")
    .toString()
    .split(":"); // Decode from base64 and split by colon
     
  return username === process.env.ADMIN_USERNAME && (await isValidPassword(password, process.env.HASHED_ADMIN_PASSWORD as string))
  
}

export const config = {
  matcher: "/admin/:path*",
};