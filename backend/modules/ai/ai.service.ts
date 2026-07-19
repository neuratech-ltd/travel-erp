import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

let aiClient: GoogleGenAI | null = null;

dotenv.config();


function getAI(){

    if(!aiClient){

        const key = process.env.GEMINI_API_KEY;

        if(!key){
            throw new Error(
              "GEMINI_API_KEY missing"
            );
        }

        aiClient = new GoogleGenAI({
            apiKey:key
        });

    }

    return aiClient;
}



export async function generateAIResponse(
    message:string,
    contextType?:string
){

    const ai = getAI();


    const response =
      await ai.models.generateContent({

        model:"gemini-3.1-flash-lite",

        contents:message,

        config:{
          systemInstruction:
          `
          You are Welcare Trip ERP AI assistant.
          Help with travel,
          medical tourism,
          booking,
          invoices and reports.
          `
        }

      });


    return response.text;

}