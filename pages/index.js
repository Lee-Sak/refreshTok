import "antd/dist/antd.css";
import { Form, Input, Button } from "antd";
import { useInput } from "../hooks/useInput";
import axios from "axios";
import { AntdLayout } from "../components/AntdLayout";
import { LOGIN_REQ, LOGIN_ERROR, LOGIN_DONE, LOGOUT } from "../reducers/user";
import { useDispatch, useSelector } from "react-redux";

const Index = () => {
  const maxLen = (value) => value.length < 50;
  const email = useInput("", maxLen);
  const password = useInput("", maxLen);
  const dispatch = useDispatch();
  const { isLoginRequest, isLoginError, isLoginDone } = useSelector(
    (state) => state.user
  );

  // axios.defaults.withCredentials = true;

  /* parameter: 토큰재발급 후 실행할 작업(함수) */
  const getRefreshedAccessToken = async (onClickTest) => {
    try {
      console.log("acctok 재발급시작");
      // 서버로 쿠키에 있는 리프레쉬 토큰이 유효한지 체크하기 위해 가져오기.
      const res = await axios.get(`http://localhost:8000/user/refTok`, {
        withCredentials: true, // 쿠키 cors 통신 보낼 때
      });
      console.log("res: ", res);
      const refToken = res.data.data;

      // ref token을 보내 401 error가 안뜨면 redis에 이메일키로 저장된 벨류를 비교
      const response = await axios.get(`http://localhost:8000/user/newAccTok`, {
        headers: {
          Authorization: refToken,
        },
      });
      if (response.data.status === "success") {
        const accTok = response.data.data;
        axios.defaults.headers.common["Authorization"] = accTok;
        onClickTest();
        console.log("acctok 재발급종료");
      }
    } catch (e) {
      if (e.response) {
        if (e.response.status === 401) {
          console.log("onClickLogout() 호출");
          alert("세션이 만료되었습니다.");
          onClickLogout();
        }
      }
    }
  };

  /* http only cookie라 서버에 들려서 값을 가져와야함 */
  const getAccessToken = async () => {
    // 토큰을 서버에서 받아온다.
    const res = await axios.get(`http://localhost:8000/user/accTok`, {
      withCredentials: true, // 쿠키 cors 통신 보낼 때
    });
    const token = res.data.data;
    axios.defaults.headers.common["Authorization"] = token;
  };

  const onClickTest = async () => {
    try {
      // 평소요청
      if (axios.defaults.headers.common["Authorization"]) {
        const response = await axios.get(`http://localhost:8000/user/test`);
        if (response.data.status === "success") {
          console.log(response.data);
        }
        // 새로고침시 axios 값이 초기화됨
      } else {
        await getRefreshedAccessToken(onClickTest);
      }
    } catch (e) {
      if (e.response) {
        // jwt accesstoken의 유효기간이 끝났을 때
        if (e.response.status === 401) {
          getRefreshedAccessToken(onClickTest);
        }
      }
    }
  };

  const onClickLogout = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/user/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      if (res.data.status === "success") {
        axios.defaults.headers.common["Authorization"] = "";
        dispatch({ type: LOGOUT });
      }
    } catch (e) {}
  };

  const onSubmitForm = async () => {
    try {
      // dispatch({ type: LOGIN_REQ });
      const response = await axios.post(
        `http://localhost:8000/user/signIn`,
        {
          email: email.value,
          password: password.value,
        },
        {
          withCredentials: true, // 쿠키 cors 통신 받을때
        }
      );

      if (response.data.status === "success") {
        const accessToken = response.data.data.accessToken;
        axios.defaults.headers.common["Authorization"] = accessToken;
        dispatch({ type: LOGIN_DONE });
      }
    } catch (e) {
      alert(e.response.data.message);
      dispatch({ type: LOGIN_ERROR });
    }
  };
  return (
    <AntdLayout isLoginDone={isLoginDone}>
      {isLoginRequest && <div className="a">Loading...</div>}
      {isLoginError && <div className="a">입력 정보를 확인하세요.</div>}
      {isLoginDone && (
        <div className="a">
          <button onClick={onClickTest}>테스트</button>
          <button onClick={onClickLogout}>로그아웃</button>
        </div>
      )}
      {!isLoginDone && (
        <div>
          <Form onFinish={onSubmitForm}>
            <div className="a">
              <div>
                <label htmlFor="user-id">이메일</label>
                <Input id="user-id" {...email} required />

                <label htmlFor="user-password">비밀번호</label>
                <Input
                  id="user-password"
                  type="password"
                  {...password}
                  required
                />
                <Button type="primary" htmlType="submit" loading={false}>
                  로그인
                </Button>
              </div>
            </div>
          </Form>
        </div>
      )}
      <style jsx>{`
        div.a {
          display: flex;
          gap: 10px;
          flex-direction: column;
          align-items: center;
          padding-top: 20px;
          padding-bottom: 10px;
        }
      `}</style>
    </AntdLayout>
  );
};

export default Index;
