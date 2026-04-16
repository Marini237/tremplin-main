import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  return NextResponse.json({ message: "Route contact OK" });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      civilite,
      nom,
      prenom,
      email,
      telephone,
      messageType,
      message,
      availabilities,
    } = body;

    if (!civilite || !nom || !prenom || !email || !messageType || !message) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants." },
        { status: 400 }
      );
    }

    const createdRequest = await prisma.contactRequest.create({
      data: {
        civilite,
        nom,
        prenom,
        email,
        telephone: telephone || null,
        messageType,
        message,
        availabilities: {
          create: Array.isArray(availabilities)
            ? availabilities.map((availability: { dateLabel: string; timeRange: string }) => ({
                dateLabel: availability.dateLabel,
                timeRange: availability.timeRange,
              }))
            : [],
        },
      },
      include: {
        availabilities: true,
      },
    });

    return NextResponse.json(
      { message: "Demande enregistrée.", data: createdRequest },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur API contact :", error);

    return NextResponse.json(
      { error: "Erreur serveur lors de l'enregistrement." },
      { status: 500 }
    );
  }
}