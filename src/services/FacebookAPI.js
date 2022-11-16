/**
 * Created by InspireUI on 05/01/2017.
 *
 * @format
 */

import { Platform } from "react-native";
import { Facebook } from "@Expo";

import { Config } from "@common";
import { toast, log } from "@app/Omni";

class FacebookAPI {
  async login() {
    const ask = await Facebook.logInWithReadPermissionsAsync(
      Config.appFacebookId,
      {
        permissions: ["public_profile", "email"],
      }
    );
    const { type } = ask;

    if (type === "success") {
      const { token } = ask;

      return token;
    }
    return null;
  }

  logout() {
    Facebook.logOut();
    log("Facebook logout!");
  }

  async getAccessToken() {
    return await Facebook.getCurrentFacebook();
  }

  async shareLink(link, desc) {
    const shareLinkContent = {
      contentType: "link",
      contentUrl: link,
      contentDescription: desc,
    };
    try {
      const canShow = await Facebook.canShow(shareLinkContent);
      if (canShow) {
        const result = await Facebook.show(shareLinkContent);
        if (!result.isCancelled) {
          toast("Post shared");
          log(`Share a post with id: ${result.postId}`);
        }
      }
    } catch (error) {
      toast("An error occurred. Please try again later");
      error(`Share post fail with error: ${error}`);
    }
  }
}

export default new FacebookAPI();
