import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import jwt from 'jsonwebtoken' 

export default async function handler(req: NextApiRequest, res: NextApiResponse){
	const receiptId = req.query.id
	const token = req.headers.authorization
	
	if(req.method === 'DELETE') {
		const receipt = await prisma.receipt.delete({
			where: {id: Number(receiptId)}
		})
		res.json({message: "Resep Berhasil dihapus"})
	} else {
		console.log("Resep Gagal dihapus");
	}
}