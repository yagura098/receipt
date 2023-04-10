import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
	const {title, content, userId} = req.body
	const token = req.headers.authorization
	console.log(userId)
	try {
		const decode = jwt.verify(token, 'kelucuan') 
	}
	catch {
		res.status(400).json({message: "Invalid Token"})
	}
	try {
		await prisma.receipt.create({
			data: {
				title,
				content,
                userId
			}
		})
		
		res.status(200).json({message: 'Berhasil Menambah Resep'})
	} catch (error) {
		console.log("Gagal Menambah Resep");
	}
}
