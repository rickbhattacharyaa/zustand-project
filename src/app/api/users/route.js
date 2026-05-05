import { getUsers, createUser } from "@/dal/users";
import { NextResponse } from "next/server";


function successResponse(data, status = 200) {
  return NextResponse.json(
    { success: true, data },
    { status }
  );
}

function errorResponse(message, status = 500) {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
}


export async function GET() {
  try {
    const users = await getUsers();

   
    if (!Array.isArray(users)) {
      console.error("Invalid data format from DAL");
      return errorResponse("Invalid data format", 500);
    }

    return successResponse(users, 200);
  } catch (error) {
    console.error("GET /api/users error:", error);
    return errorResponse("Failed to fetch users", 500);
  }
}



export async function POST(req) {
  try {
    const body = await req.json();

    
    const { name, email } = body || {};

    if (!name || typeof name !== "string") {
      return errorResponse("Name is required and must be a string", 400);
    }

    if (!email || typeof email !== "string") {
      return errorResponse("Email is required and must be a string", 400);
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse("Invalid email format", 400);
    }


    const newUser = await createUser({ name, email });

    return successResponse(newUser, 201);
  } catch (error) {
    console.error("POST /api/users error:", error);


    if (error.message?.includes("Email already exists")) {
      return errorResponse("Email already exists", 409);
    }


    if (error instanceof SyntaxError) {
      return errorResponse("Invalid JSON body", 400);
    }

    return errorResponse("Failed to create user", 500);
  }
}