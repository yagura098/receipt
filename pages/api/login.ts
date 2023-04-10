import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;

  switch (method) {
    case "GET":
      try {
        return res.status(200).json({
          message: "Success",
          data: null,
        });
      } catch (error) {
        console.log(error);

        return res.status(500).json({
          message: "Failed",
          error: error,
        });
      }
    case "POST":
      try {
        console.log(body)
        
        const {username, password} = body;

        let is_username_exist = false;

        let payload = {
            id: -1,
            username: "",
        }

        await prisma.user.findMany({
            select: {
              id: true,
              username: true,
              password: true,
            },
          }).then((users) => {
            // console.log(users);
            users.map((e) => {
                if (e.username == username && password == e.password) {
                    is_username_exist = true;

                    (payload.id = e.id),
                    (payload.username = e.username)
                }
            })
          });

          if (is_username_exist) {
            // console.log("username dan password");
  
            const token = jwt.sign(payload, "kelucuan", {
              expiresIn: "6h",
            });
            // console.log(token);
  
            return res.status(200).json({
              message: "Data succesfully retrieved",
              data: token,
            });
          } else {
            return res.status(404).json({
              message: "User not found",
            });
          }

        return res.status(200).json({
          message: "Success",
          data: null,
        });
      } catch (error) {
        console.log(error);

        return res.status(500).json({
          message: "Failed",
          error: error,
        });
      }
  }
}

export const getServerSideProps: GetServerSideProps = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      password: true,
    },
  });

  // console.log(users);
  return {
    props: {
      users,
    },
  };
};
