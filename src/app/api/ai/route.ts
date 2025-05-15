import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function POST() {
    try {
        const contents =
            "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be?|| What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
        // const {contents} = await request.json()
        const ab = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents,
        });

        console.log(ab.text);
        return NextResponse.json({ result: ab.text });
    } catch {
        return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 });
    }
}
