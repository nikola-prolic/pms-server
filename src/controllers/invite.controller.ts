import { Request, Response } from "express";
import prisma from "../prisma";

export async function createInvite(req: Request, res: Response) {
  const { userEmail, organizationId } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail
      }
    })
    const newInvite = await prisma.invite.create({
      data: {
        userEmail,
        organizationId,
        userId: user.id,
      },
    });
    res.status(201).json({ message: "Invite created", invite: newInvite });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to create invite" });
  }
}

export async function acceptInvite(req: Request, res: Response) {
  const id = req.params.id;
  try {
    const invite = await prisma.invite.findUnique({
      where: { id },
    });
    if (!invite) {
      return res.status(404).json({ error: "Invite not found" });
    }
    await prisma.user.update({
      where: {
        id: invite.userId,
      },
      data: {
        organizationId: invite.organizationId
      }
    })
    await prisma.invite.delete({
      where: {
        id: id
      }
    })
    res.status(200).json({ invite: invite });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Error retrieving invite" });
  }
}

export async function getInviteById(req: Request, res: Response) {
  const id = req.params.id;
  try {
    const invite = await prisma.invite.findUnique({
      where: { id },
    });
    if (!invite) {
      return res.status(404).json({ error: "Invite not found" });
    }
    res.status(200).json(invite);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Error retrieving invite" });
  }
}

export async function getInviteByOrgId(req: Request, res: Response) {
  const orgId = req.params.orgId;
  try {
    const invite = await prisma.invite.findUnique({
      where: { organizationId: orgId },
      include: {
        organization: true,
        user: true,
      },
    });
    if (!invite) {
      return res.status(404).json({ error: "No invite found for this email" });
    }
    res.status(200).json(invite);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Error retrieving invite by email" });
  }
}

export async function getInviteByEmail(req: Request, res: Response) {
  const userEmail = req.params.email;
  try {
    const invite = await prisma.invite.findUnique({
      where: { userEmail },
      include: {
        organization: true,
        user: true,
      },
    });
    if (!invite) {
      return res.status(404).json({ error: "No invite found for this email" });
    }
    res.status(200).json(invite);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Error retrieving invite by email" });
  }
}

export async function listInvites(_req: Request, res: Response) {
  try {
    const invites = await prisma.invite.findMany({});
    res.status(200).json({ invites });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Error fetching invites" });
  }
}

export async function deleteInvite(req: Request, res: Response) {
  const id = req.params.id;
  try {
    await prisma.invite.delete({
      where: { id },
    });
    res.status(200).json({ message: "Invite deleted" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete invite" });
  }
}
