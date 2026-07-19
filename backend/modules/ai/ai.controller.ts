import { Request, Response } from "express";
import { generateAIResponse } from "./ai.service.js";


export async function chat(
  req: Request,
  res: Response
){

  try {

    const {message, contextType} = req.body;

    const text = await generateAIResponse(
      message,
      contextType
    );

    return res.json({
      success:true,
      text
    });


  } catch(error:any){

    console.error("AI ERROR:", error);

    return res.status(500).json({
      success:false,
      message:error.message
    });

  }

}