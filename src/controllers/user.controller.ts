import { Request, Response } from "express";
import { Filter } from "../types/db";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";

type CreateUserInput = {
  name: string;
  email: string;
};
export async function createUser(req: Request, res: Response) {
  const reqUser: CreateUserInput = req.body.user;
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: reqUser.email,
      },
    });
    if (existingUser) {
      res.status(200).json({ message: "user exists", user: existingUser });
      return;
    }
    const user = await prisma.user.create({
      data: {
        name: reqUser.name,
        email: reqUser.email,
      },
      include: {
        organization: {
          include: {
            users: true,
          }
        },
        tasks: true,
        projects: true,
        invite: {
          include: {
            organization: true,
          }
        }
      }
    });
    res.status(201).json({
      message: "new user created",
      user: user,
    });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
}
type UpdateUserInput = {
  name?: string;
  organizationId?: number;
};
export async function updateUser(req: Request, res: Response) {
  const userId = req.params.id;
  const updateData: UpdateUserInput = req.body.user;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        organization: true
      }
    });

    res.json({
      user: updatedUser
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        // Record not found
        return res.status(404).json({ error: "User not found" });
      }
    }

    console.error(error);
    res.status(500).json({ error: "Error updating user" });
  }
}

export async function getUserById(req: Request, res: Response) {
  const id = req.params.id;
  if (!id || typeof id != "string" || id.length < 1) {
    res.status(400).json({ error: "invalid id" });
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        invite: {
          include: {
            organization: true,
          }
        },
        tasks: true,
        projects: true,
        organization: {
          users: true
        }
      }
    });
    if (!user) {
      res.status(404).json({ error: "user not found" });
      return;
    }
    res.status(200).json({
      message: "user found",
      user: user,
    });
  } catch (err) {
    console.log("we have a problem finding user");
  }
}

type UserFilters = {
  name?: Filter;
  email?: Filter;
  organizationId?: string;
};

export async function getUserByEmail(req: Request, res: Response) {
  const email = req.params.email;
  if (!email || typeof email != "string" || email.length < 1) {
    res.status(400).json({ error: "invalid id" });
  }
  console.log(email.length);
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        organization: {
          include: {
            users: true,
            invites: true
          }
        },
        projects: true,
        tasks: true,
        invite: {
          include: {
            organization: true,
          }
        }
      }
    });
    if (!user) {
      console.log("what happened user is: ", user);
      res.status(404).json({ error: "user not found" });
      return;
    }
    res.status(200).json({
      message: "user found",
      user: user,
    });
  } catch (err) {
    console.log("we have a problem finding user", err);
    res.status(500).json({ error: "no user found" })
  }
}

export async function queryUsers(req: Request, res: Response) {
  const { name, email, organizationId } = req.query;
  if (
    (typeof name !== "string" && typeof name !== "undefined") ||
    (typeof email !== "string" && typeof email !== "undefined") ||
    (typeof organizationId !== "string" &&
      typeof organizationId !== "undefined")
  ) {
    res.status(400).json({ error: "invalid query" });
    return;
  }
  try {
    // Build the filter object dynamically:
    const whereFilter: UserFilters = {
      name: name ? { contains: name, mode: "insensitive" } : undefined,
      email: email ? { contains: email, mode: "insensitive" } : undefined,
      organizationId,
    };

    Object.keys(whereFilter).forEach(
      (key) =>
        whereFilter[key as keyof typeof whereFilter] === undefined &&
        delete whereFilter[key as keyof typeof whereFilter],
    );

    const users = await prisma.user.findMany({
      where: whereFilter,
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
}

export async function deleteUser(req: Request, res: Response) {
  const id = req.params.id;

  try {
    const user = await prisma.user.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
}
