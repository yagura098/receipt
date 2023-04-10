import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import { use } from "react";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
	const {username, password} = req.body
	console.log(username)
	try {
		await prisma.user.create({
			data: {
				username,
				password
			}
		})
		res.status(200).json({message: 'User Succesfully Created'})
	} catch (error) {
		res.status(400).json({message: 'Failed to Create User'})
		console.log("Failed to Create User");
	}
}