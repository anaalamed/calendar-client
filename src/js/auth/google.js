import axios from "axios";
import { serverAddress } from "../constants";

const redirectToGoogle = async () => {
  console.log("redirectToGoogle");

  const redirectLink = serverAddress + "/oauth2/authorization/google";
  console.log(redirectLink);

  try {
    let res = await fetch(redirectLink, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let resJson = await res.text();
    console.log(resJson);
    if (res.ok) {
      window.alert("email activation was sent, please check your email");
      navigate("/login");
      //props.onFormSwitch('login');
    } else {
      window.alert("could not create user " + resJson);
    }
  } catch (err) {
    console.log(err);
  }

  //   const request = await axios({
  //     method: "get",
  //     url: redirectLink,
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });

  //   console.log(request);
};

export { redirectToGoogle };
