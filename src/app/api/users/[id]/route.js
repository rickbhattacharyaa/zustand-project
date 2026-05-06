
import { NextResponse } from "next/server";
import { updateUser, deleteUser, getUserById } from "@/dal/users";

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


export async function GET(_req,context) {
  try {
    
    const { id } = await context.params;
    const user = await getUserById(id);

    if (!user) {
      return errorResponse("User not found", 404);
    }

    return successResponse(user);
  } catch (error) {
    
    return errorResponse("Failed to fetch user", 500);
  }
}


export async function PUT(req, context) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    if (!body || Object.keys(body).length === 0) {
      return errorResponse("No update data provided", 400);
    }

    
    if (body.name && typeof body.name !== "string") {
      return errorResponse("Name must be a string", 400);
    }

    if (body.email && typeof body.email !== "string") {
      return errorResponse("Email must be a string", 400);
    }

    const updatedUser = await updateUser(id, body);

    if (!updatedUser) {
      return errorResponse("User not found", 404);
    }

    return successResponse(updatedUser);
  } catch (error) {
    console.error("PUT /api/users/:id error:", error);

    if (error instanceof SyntaxError) {
      return errorResponse("Invalid JSON body", 400);
    }

    return errorResponse("Failed to update user", 500);
  }
}


export async function DELETE(_req, context) {
  try {
    const { id } = await context.params;
    const deleted = await deleteUser(id);

    if (!deleted) {
      return errorResponse("User not found", 404);
    }

    return successResponse({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/users/:id error:", error);
    return errorResponse("Failed to delete user", 500);
  }
}