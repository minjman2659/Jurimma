const { content, thumbs } = require("../../models");
const { generateAccessToken, isAuthorized } = require("../tokenFunction/accessToken");
const { refreshAuthorized } = require("../tokenFunction/refreshToken");
const { verify } = require("jsonwebtoken");

module.exports = {
    post: (req, res) => {
        if(isAuthorized(req)) {
            // accessToken이 만료되지 않았을 경우,
            // => 바로 요청에 대한 응답 제공
            const { contentsId } = req.body;
            content.destroy({
                where: {id: contentsId},
                force: true
            })
            .then(() => {
                return thumbs.destroy({
                    where: {content_Id: contentsId},
                    force: true
                });
            })
            .then((data) => {
                console.log(data);
                res.status(200).json({message: "ok"});
            })
            .catch((err) => {
                console.log(err);
            });
        } else {
            // accessToken이 만료되어서 refreshToken을 판별하고,
            // refreshToken은 만료되지 않았을 경우,
            // => 요청에 대한 응답과 함께 새로 만든 accessToken 발급
            if(refreshAuthorized(req)) {
                const token = req.cookies.refreshToken;
                const tokenCheck = verify(token, process.env.REFRESH_SECRET);
                const accessToken = generateAccessToken(tokenCheck);

                const { contentsId } = req.body;
                content.destroy({
                    where: {id: contentsId},
                    force: true
                })
                .then(() => {
                    return thumbs.destroy({
                        where: {content_Id: contentsId},
                        force: true
                    });
                })
                .then((data) => {
                    console.log(data);
                    res.status(201).json({
                        accessToken: accessToken,
                        message: "ok"
                    });
                })
                .catch((err) => {
                    console.log(err)
                });
            } else {
                // accessToken이 만료되어서 refreshToken을 판별하고,
                // refreshToken도 만료되었을 경우,
                // 클라이언트에게 다시 로그인을 하라는 메시지 응답을 보낸다.
                res.status(401).json({ message: "Send new Login Request" });
            }
        } 
    },
}