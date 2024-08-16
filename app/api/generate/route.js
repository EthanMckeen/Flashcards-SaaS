import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `Purpose: Develop educational flashcards to aid students in learning and retaining information effectively.

Content Focus:

Include clear and concise questions and answers.
Incorporate definitions and key concepts.
Use visual aids or mnemonics to enhance memory retention.
Customization:

Tailor flashcards to the subject matter and learning objectives.
Adjust the level of difficulty based on the learner’s needs.
Learning Techniques:

Encourage active recall through well-designed questions.
Support spaced repetition to optimize long-term retention.

only generate 10 flash cards
Design Considerations:

Ensure that flashcards are easy to use and understand.
Keep the content relevant and focused on key learning points.


Return in the following JSON format
{
    "flashcards":
    [
        {
            "front": str,
            "back": str,
        }
    ]
}
`

export async function POST(req){
    const openai = new OpenAI()
    const data = await req.text()

    const completion = await openai.chat.completions.create({
        messages: [
            {role: 'system', content: systemPrompt},
            {role: 'user', content: data},
        ],
        model: "gpt-4o",
        response_format:{type:"json_object"}
    })

    const flashcards = JSON.parse(completion.choices[0].message.content)

    return NextResponse.json(flashcards.flashcards)
}
