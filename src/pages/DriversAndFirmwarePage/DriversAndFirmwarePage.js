import React, { useState } from "react";
import usePolicyData from "../../hooks/usePolicyData";

import { Col, Container, Row } from "react-bootstrap"; //MIT LICENSE < https://github.com/react-bootstrap/react-bootstrap >
import {
  BsArrowRepeat,
  BsFileText,
  BsFillPlusSquareFill,
} from "react-icons/bs"; //MIT LICENSE < https://github.com/twbs/icons >
import { IconButton } from "../../components/buttons/iconButton";
import "../../components/table/paginatedTable";
import { PaginatedTable } from "../../components/table/paginatedTable";
import CreatePolicyModal from "../../components/modal/createPolicyModal";
import { CreatePolicy } from "../../api/createPolicy";
import { exportPoliciesToCsv } from "../../utils/exportPoliciesToCsv";
import SpinnerCommon from "../../components/SpinnerCommon";
import EditModalWindow from "../../components/modal/editPolicyModel";
import { updateDeploymentAudience } from "../../api/updateDeploymentAuidence";

export default function DriversAndFirmwarePage() {
  const [
    policies,
    isLoading,
    refreshPolicyData,
    refreshPolicy,
    policyToMembers,
  ] = usePolicyData();
  const [spinner, setSpinner] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [audienceCreatedId, setAudienceCreatedId] = useState(null);
  const [policyToEditId, setPolicyToEditId] = useState(null);

  async function handleCreateAudienceAndPolicy(policyName, type) {
    setSpinner(true);
    let data = await CreatePolicy(policyName, type);
    console.log(data);
    setAudienceCreatedId(data.audienceId);
    setPolicyToEditId(data.policyId);
    setShowCreateModal(false);
    setSpinner(false);
    setShowEditModal(true);
    await refreshPolicyData();
  }

  const policyButtons = [
    {
      text: "New",
      icon: <BsFillPlusSquareFill className="me-2 mb-1" />,
      onClick: () => setShowCreateModal(true),
    },
    {
      text: "Refresh",
      icon: <BsArrowRepeat className="me-2 mb-1" />,
      onClick: async () => {
        await refreshPolicyData();
      },
    },
    {
      text: "Export",
      icon: <BsFileText className="me-2 mb-1" />,
      onClick: () => {
        exportPoliciesToCsv(policies);
      },
    },
  ];

  async function handleUpdateDeploymentAudience(payload, audienceId) {
    setSpinner(true);
    await updateDeploymentAudience(payload, audienceId);
    setSpinner(false);
  }

  const handleToggleEditModal = async () => {
    setShowEditModal(!showEditModal);
    await refreshPolicyData();
  };

  if (isLoading) {
    return <SpinnerCommon />;
  }

  return (
    <>
      <Container>
        <Row>
          <Col>
            <h2 className="ms-2 mt-5 mb-5 ">Policies</h2>
            <Row>
              {/* policy create, refresh and export buttons */}
              <Col xs={10}>
                {policyButtons.map((btn) => (
                  <IconButton
                    key={btn.text}
                    text={btn.text}
                    icon={btn.icon}
                    isDark={true}
                    onClick={btn.onClick}
                  />
                ))}
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Table with Pagination */}
        <PaginatedTable
          policies={policies}
          isLoading={isLoading}
          refreshPolicyData={refreshPolicyData}
          setShowEditModal={setShowEditModal}
          setPolicyToEditId={setPolicyToEditId}
          setAudienceCreatedId={setAudienceCreatedId}
        />

        {/* Modal Window for creating Policy*/}
        <CreatePolicyModal
          isModelWindowOpen={showCreateModal}
          handleCreatePolicy={handleCreateAudienceAndPolicy}
          toggleModal={() => setShowCreateModal(!showCreateModal)}
          spinner={spinner}
        />

        <EditModalWindow
          policies={policies}
          isModelWindowOpen={showEditModal}
          policyToEditId={policyToEditId}
          audienceId={audienceCreatedId}
          onSubmit={handleUpdateDeploymentAudience}
          toggleModal={handleToggleEditModal}
          refreshPolicy={refreshPolicy}
          policyToMembers={policyToMembers}
        />
      </Container>
    </>
  );
}
