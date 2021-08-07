const User = require('../models/user'); // User 모델 
let jwt = require("jsonwebtoken"); // 암호화를 위한 jwt 모듈
let secretObj = require("../config/jwt"); // key 모듈

// 로그인 Request 처리
exports.userLogin = (req, res, next) => {
    // id로 해당 아이디를 가진 데이터를 db에서 찾기
    User.findByPk(req.body.user_id).then(user=>{
        if (req.body.user_id == user.user_id && req.body.user_password == user.user_password){
            // 있다면 성공 json 보내기
            res.send(JSON.stringify({
                "success": true,
                "statusCode" : 200,
                "token" : user.user_mToken
            }));
        }
        else{
            // 없다면 실패 json 보내기
            res.send(JSON.stringify({
                "success": false,
                "statusCode" : 400,
                "token" : "DENIED"
            }));
        }
    })
    .catch(err=>{
        // 오류시 실패 json 보내기
        res.send(JSON.stringify({
            "success": false,
            "statusCode" : 400,
            "token" : "DENIED"
        }));
    });
}

// 회원가입 Request 처리
exports.userRegister = (req, res, next) => {
    // 토큰 생성 
    let token = jwt.sign({
        user_id : req.body.user_id,
        user_password : req.body.user_password,
        user_name : req.body.user_name
    }
    , secretObj.secret
    , { expiresIn: '365d'});
    
    // User 객체 생성
    User.create({
        user_id: req.body.user_id,
        user_password: req.body.user_password,
        user_name: req.body.user_name,
        user_gender: req.body.user_gender,
        user_age: req.body.user_age,
        user_address: req.body.user_address,
        user_life_cycle: req.body.user_life_cycle,
        user_family: req.body.user_family,
        user_income: req.body.user_income,
        user_is_disabled: req.body.user_is_disabled,
        user_is_veterans: req.body.user_is_veterans,
        user_interest: req.body.user_interest,
        user_mToken: token
    })
    .then(result=>{
        // 성공시 성공 json 보내기
        res.send(JSON.stringify({
            "success": true,
            "statusCode" : 200,
            "token" : token
        }));
    })
    .catch(err=>{
        // 오류시 실패 json 보내기
        res.send(JSON.stringify({
            "success": false,
            "statusCode" : 400,
            "token" : token
        }));
    });
}

// 유저의 정보를 가져다주는 함수
exports.userRead = (req, res, next) => {
}

// 유저 정보 갱신 Request 처리
exports.userUpdate = (req, res, next) => {
    // 유저 정보 업데이트 
    User.update({
        user_id:req.body.user_id,
        user_password:req.body.user_password,
        user_name: req.body.user_name,
        user_gender: req.body.user_gender,
        user_age: req.body.user_age,
        user_address: req.body.user_address,
        user_life_cycle: req.body.user_life_cycle,
        user_family: req.body.user_family,
        user_income: req.body.user_income,
        user_is_disabled: req.body.user_is_disabled,
        user_is_veterans: req.body.user_is_veterans,
        user_interest: req.body.user_interest,
    }, { where: { user_mToken: req.body.token }})
    .then(result=>{
        // 성공시 성공 json 보내기
        res.send(JSON.stringify({
            "success": true,
            "statusCode" : 200,
            "token" : req.body.token
        }));
    })
    .catch(err=>{
        // 오류시 실패 json 보내기
        res.send(JSON.stringify({
            "success": false,
            "statusCode" : 400,
            "token" : req.body.token
        }));
    }); 
}

// 유저 삭제 Request 처리
exports.userDelete = (req, res, next) => {
    // 토큰 값으로 해당 유저 검색
    User.findOne({
        where: { user_mToken: req.body.token }
      })
      .then(user=>{
        // 성공시 삭제
        user.destroy();
      })
      .then(result=>{
        // 삭제후 성공 json 보내기 
        res.send(JSON.stringify({
            "success": true,
            "statusCode" : 200
        }));
      })
      .catch(err=>{
        // 오류시 실패 json 보내기 
        res.send(JSON.stringify({
            "success": false,
            "statusCode" : 400
        }));
      });
}