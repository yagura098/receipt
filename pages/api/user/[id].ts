import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
	const receiptId = req.query.id
	const token = req.headers.authorization
    const decode = jwt.verify(token, 'kelucuan') 
    
    if(req.method === "GET"){
        const userId = decode['id']; 


        const receipts = await prisma.receipt.findMany({
            select: {
            title: true,
            id: true,
            content: true
            },
            where : {
            userId:  Number(userId)
            }
        })
        
        res.status(200).json(receipts)
    }
    else {
        res.status(401).json({messages: "Gagal"})
    }
}