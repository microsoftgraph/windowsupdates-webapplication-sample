import { Button, Col, Container, Nav, Row } from "react-bootstrap";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import "./UpdatePage.css";

import React, { useEffect, useState } from "react";
import { UpdatesTable } from "../../components/table/UpdatesTable";
import { useUpdateData } from "../../hooks/useUpdateData";
import { useParams } from "react-router-dom";
import SpinnerCommon from "../../components/SpinnerCommon";
import { BsFileBreak } from "react-icons/bs";
import { ToastContainer } from "react-toastify";
export default function UpdatePage() {
  const { id } = useParams();
  const [
    updatesInfoData,
    isAutomaticPolicy,
    catalogIdToApprovals,
    catalogIdToRevokedContentApproval,
    catalogIdToApprovedContentApproval,
    isLoading,
    refreshUpdatesData,
  ] = useUpdateData(id);
  const [driversUpdates, setDriversUpdates] = useState([]);
  const [isRecommendedUpdatesSelected, setIsRecommendedUpdatesSelected] =
    useState(false);

  const handleNavigationClick = (isRecommendedUpdates) => {
    const recommendedUpdates = [];
    const otherUpdates = [];
    // filter out the updates that are recommended by Microsoft
    for (let i = 0; i < updatesInfoData.length; i++) {
      if (updatesInfoData[i].matchedDevices.length > 0) {
        if (
          updatesInfoData[i].matchedDevices[0].recommendedBy.includes(
            "Microsoft"
          )
        ) {
          recommendedUpdates.push(updatesInfoData[i]);
        } else {
          otherUpdates.push(updatesInfoData[i]);
        }
      } else {
        otherUpdates.push(updatesInfoData[i]);
      }
    }
    setIsRecommendedUpdatesSelected(isRecommendedUpdates);
    setDriversUpdates(isRecommendedUpdates ? recommendedUpdates : otherUpdates);
  };

  useEffect(() => {
    // When the page is loaded, the recommended updates are selected by default
    handleNavigationClick(true);
  }, [updatesInfoData]);

  if (isLoading) {
    return <SpinnerCommon />;
  }

  return (
    <Container>
      {/* First row contain the title and back button */}
      <Row className="ms-2 mt-5 mb-5 me-auto">
        <Col xl={10}>
          <h2>Updates</h2>
        </Col>
        <Col>
          <Button
            className="btn btn-dark"
            style={{ marginLeft: "auto", marginRight: 0, height: "40px" }}
            href="/"
          >
            <IoChevronBackCircleSharp />
            &nbsp;&nbsp;Back
          </Button>
        </Col>
      </Row>

      {/* navbar with tabs */}
      <Nav variant="tabs" defaultActiveKey="RecommendedUpdates">
        <Nav.Item>
          <Nav.Link
            eventKey="RecommendedUpdates"
            onClick={() => handleNavigationClick(true)}
          >
            Recommended Updates
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="OtherUpdates"
            disabled={!!isAutomaticPolicy}
            onClick={() => handleNavigationClick(false)}
          >
            Other Updates
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <Row>
        {!isLoading && driversUpdates.length !== 0 ? (
          <UpdatesTable
            updatesInfoData={driversUpdates}
            catalogIdToApprovals={catalogIdToApprovals}
            catalogIdToRevokedContentApproval={
              catalogIdToRevokedContentApproval
            }
            catalogIdToApprovedContentApproval={
              catalogIdToApprovedContentApproval
            }
            isRecommendedUpdates={isRecommendedUpdatesSelected}
            refreshUpdatesData={refreshUpdatesData}
          />
        ) : (
          <div className="text-center m-4 p-4">
            {" "}
            <BsFileBreak></BsFileBreak> No Updates Available
          </div>
        )}
      </Row>
      <ToastContainer />
    </Container>
  );
}
