import { Request, Response } from "express";
import prisma from "../prisma";

export async function createOrganization(req: Request, res: Response) {
  const { name, adminId } = req.body;
  try {
    const newOrganization = await prisma.organization.create({
      data: {
        name,
        adminId,
      },
    });
    await prisma.user.update({
      where: {
        id: adminId,
      },
      data: {
        organizationId: newOrganization.id
      }
    })
    res
      .status(201)
      .json({ message: "Organization created", organization: newOrganization });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to create organization" });
  }
}

export async function getOrganizationById(req: Request, res: Response) {
  const id = req.params.id;
  try {
    const organization = await prisma.organization.findUnique({
      where: { id },
      include: { users: true, projects: true },
    });
    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }
    res.status(200).json({ organization: organization });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Error retrieving organization" });
  }
}


export async function updateOrganization(req: Request, res: Response) {
  const id = req.params.id;
  const { name } = req.body;
  try {
    const updatedOrganization = await prisma.organization.update({
      where: { id },
      data: { name },
    });
    res.json({
      message: "Organization updated",
      organization: updatedOrganization,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to update organization" });
  }
}

export async function deleteOrganization(req: Request, res: Response) {
  const id = req.params.id;
  try {
    await prisma.organization.delete({
      where: { id },
    });
    res.status(200).json({ message: "Organization deleted" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete organization" });
  }
}

export async function listOrganizations(_req: Request, res: Response) {
  try {
    const organizations = await prisma.organization.findMany({
      include: { users: true, projects: true },
    });
    res.status(200).json({ organizations });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Error fetching organizations" });
  }
}
