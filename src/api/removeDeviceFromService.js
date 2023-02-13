import { dssEndpoint } from "../config/Constants";
import { GetHeaders } from "../utils/fetchHelper";
import { toast } from "react-toastify";
import axios from "axios";
import { notify } from "../utils/notify";

// Delete Policy based on the PolicyID
export async function removeDeviceFromService(deviceId) {
  let body = {
    updateCategory: "driver",
    assets: [
      {
        "@odata.type": "#microsoft.graph.windowsUpdates.azureADDevice",
        id: deviceId,
      },
    ],
  };

  let apiConfig = {
    headers: GetHeaders(),
  };

  await axios
    .post(`${dssEndpoint}/updatableAssets/unenrollAssets`, body, apiConfig)
    .then((res) => {
      notify("Device removed Successfully", "success");
    })
    .catch((err) => {
      console.log(err);
      notify("Device failed to remove with error: " + err, "error");
    });
}
