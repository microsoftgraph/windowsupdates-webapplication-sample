import { Button } from "react-bootstrap";
import { BsCheck, BsPause, BsViewList } from "react-icons/bs";
import MetadataDataModal from "../modal/metaDataModal";
import ContentApproveModal from "../modal/contentApproveModal";
import SuspendModal from "../modal/suspendModal";
import { useMemo, useState } from "react";
import MaterialReactTable from "material-react-table";

export function UpdatesTable({
  updatesInfoData,
  catalogIdToApprovals,
  catalogIdToRevokedContentApproval,
  catalogIdToApprovedContentApproval,
  isRecommendedUpdates,
  refreshUpdatesData,
}) {
  const updateInfoColumns = useMemo(
    () => [
      { header: "Update Name", accessorKey: "updateName" },
      { header: "Release Date", accessorKey: "releaseDateTime" },
      { header: "Applicable Devices", accessorKey: "applicableDeviceCount" },
      { header: "Driver Class", accessorKey: "driverClass" },
      { header: "Approval Start Date", accessorKey: "approvalDate" },
      { header: "Suspension Date", accessorKey: "suspensionDate" },
    ],
    []
  );

  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [rowSelection, setRowSelection] = useState({});

  let selectedUpdate = Object.keys(rowSelection)[0];
  return (
    <div>
      <h6 className={"text-center mt-1"}>
        {updatesInfoData[selectedUpdate]?.updateName}
      </h6>
      <div className="d-flex justify-content-center mb-3">
        <div>
          <Button
            disabled={selectedUpdate === undefined}
            className="m-1"
            variant="outline-dark"
            size="sm"
            onClick={() => setShowMetadataModal(true)}
          >
            <BsViewList className="me-2 ms-1 mb-1" />
            View Metadata
          </Button>
        </div>
        <div>
          <Button
            disabled={
              selectedUpdate === undefined ||
              updatesInfoData[selectedUpdate]?.catalogEntryId in
                catalogIdToApprovedContentApproval
            }
            className="m-1"
            variant="outline-dark"
            size="sm"
            onClick={() => setShowApproveModal(true)}
          >
            <BsCheck className="me-2 ms-1 mb-1" />
            Approve
          </Button>
        </div>
        <div>
          <Button
            disabled={
              selectedUpdate === undefined ||
              !(
                updatesInfoData[selectedUpdate]?.catalogEntryId in
                catalogIdToApprovedContentApproval
              )
            }
            className="m-1"
            variant="outline-dark"
            size="sm"
            onClick={() => setShowSuspendModal(true)}
          >
            <BsPause className="me-2 ms-1 mb-1" />
            Suspend
          </Button>
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <MaterialReactTable
          columns={updateInfoColumns}
          data={updatesInfoData}
          enableColumnActions={false}
          enableColumnFilters={false}
          enablePagination={true}
          enableSorting={false}
          enableBottomToolbar={false}
          enableTopToolbar={false}
          muiTableBodyRowProps={{ hover: false }}
          enableMultiRowSelection={false}
          enableRowSelection
          onRowSelectionChange={setRowSelection}
          state={{ rowSelection }}
        />
      </div>

      <MetadataDataModal
        isOpen={showMetadataModal}
        updateInfo={updatesInfoData[selectedUpdate]}
        toggleModal={() => setShowMetadataModal(false)}
      />

      <ContentApproveModal
        isOpen={showApproveModal}
        catalogIdToRevokedContentApproval={catalogIdToRevokedContentApproval}
        updateInfo={updatesInfoData[selectedUpdate]}
        isRecommendedUpdates={isRecommendedUpdates}
        toggleModal={() => setShowApproveModal(false)}
        refreshUpdatesData={refreshUpdatesData}
      />

      <SuspendModal
        isOpen={showSuspendModal}
        updateInfo={updatesInfoData[selectedUpdate]}
        catalogIdToApprovals={catalogIdToApprovals}
        toggleModal={() => setShowSuspendModal(false)}
        refreshUpdatesData={refreshUpdatesData}
      />
    </div>
  );
}
