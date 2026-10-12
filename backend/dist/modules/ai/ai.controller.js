import { generateAIResponse } from "./ai.service.js";
export async function chat(req, res) {
    try {
        const { message, contextType } = req.body;
        const text = await generateAIResponse(message, contextType);
        return res.json({
            success: true,
            text
        });
    }
    catch (error) {
        console.error("AI ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
