import React, { useRef, useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import { BsFillTrashFill } from "react-icons/bs";
import { removeDeviceFromService } from "../../api/removeDeviceFromService";
import { updateDeploymentAudience } from "../../api/updateDeploymentAuidence";
import { entityType } from "../../config/Constants";
import { IconButton } from "../buttons/iconButton";
import ConfirmModal from "../modal/confirmationModal";
import SpinnerCommon from "../SpinnerCommon";

export default function MemberTable(props) {
  const { policy, policyMembers, spinner, setSpinner, refreshPolicy } = props;
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [selectedPolicyId, setSelectedPolicyId] = useState(null);

  async function handleRemoveMembers(deviceId, audienceId, policyId) {
    setSpinner(true);
    let requestBody = JSON.stringify({
      removeMembers: [
        {
          "@odata.type": entityType + ".azureADDevice",
          id: deviceId,
        },
      ],
    });
    await updateDeploymentAudience(requestBody, audienceId);
    setSpinner(false);
    await refreshPolicy(policyId);
  }

  async function handleRemoveMemberFromService(deviceId, policyId) {
    console.log("Removing from service");
    setSelectedDeviceId(deviceId);
    setSelectedPolicyId(policyId);
    setShowConfirmModal(true);
  }

  return (
    <>
      {spinner ? <SpinnerCommon /> : null}
      <div className={"mt-4 ps-3 pe-3"}>
        <p style={{ fontStyle: "italic" }} className="m-2">
          Devices can take up to 2 hours to populate after being added to a
          policy, if the problem persist please contact support.
        </p>
        <Table striped hover>
          <thead>
            <tr>
              <th> Device ID</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {policyMembers?.map((member) => (
              <tr key={member.id}>
                <td>{member.id}</td>
                <td>
                  <IconButton
                    key={"delete_from_policy" + member.id}
                    rootClose={true}
                    text={"Delete"}
                    toolTipMessage="Delete device from policy"
                    icon={<BsFillTrashFill className="mr-2 ml-1 mb-1" />}
                    onClick={() =>
                      handleRemoveMembers(
                        member?.id,
                        policy?.audience?.id,
                        policy?.id
                      )
                    }
                  />

                  <IconButton
                    key={"remove_from_service" + member.id}
                    text={"Remove"}
                    icon={<BsFillTrashFill className="mr-2 ml-1 mb-1" />}
                    toolTipMessage={"Remove Device from Service"}
                    onClick={() =>
                      handleRemoveMemberFromService(member?.id, policy?.id)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <ConfirmModal
          isOpen={showConfirmModal}
          toggleModal={() => setShowConfirmModal(false)}
          deviceId={selectedDeviceId}
          policyId={selectedPolicyId}
          refreshPolicy={refreshPolicy}
          messageToDisplay="This action will remove the device from the service entirely. If it
          was added to other Drivers policies it will be removed from them as
          well."
        />
      </div>
    </>
  );
}
