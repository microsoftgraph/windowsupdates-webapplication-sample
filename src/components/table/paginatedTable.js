import React, { useEffect, useMemo, useState } from "react";
import { BsFillTrashFill, BsViewList } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IconButton } from "../buttons/iconButton";
import DeleteModal from "../modal/deleteModal";
import MaterialReactTable from "material-react-table";

export const PaginatedTable = (props) => {
  const policiesColumns = useMemo(
    () => [
      { header: "Policy ID", accessorKey: "policyId" },
      { header: "Audience Id", accessorKey: "audienceId" },
      { header: "Policy Name", accessorKey: "policyName" },
      { header: "Device Count", accessorKey: "deviceCount" },
      { header: "Type of Policy", accessorKey: "policyType" },
      { header: "Action", accessorKey: "action" },
    ],
    []
  );

  const navigate = useNavigate();
  const {
    policies,
    isLoading,
    refreshPolicyData,
    setShowEditModal,
    setPolicyToEditId,
    setAudienceCreatedId,
  } = props;
  const [spinner, setSpinner] = useState(false);
  const [policyTableData, setPolicyTableData] = useState([]);
  const [selectedPolicyToDelete, setSelectedPolicyToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const actionsButtons = [
    {
      text: "Edit",
      icon: <FaRegEdit className="mr-2 ml-1 mb-1" />,
      onClick: (policy, audienceId) => {
        setAudienceCreatedId(policy.audience?.id);
        setPolicyToEditId(policy.id);
        setShowEditModal(true);
      },
    },
    {
      text: "View",
      icon: <BsViewList className="mr-2 ml-1 mb-1" />,
      onClick: (policy) => {
        navigate("policy/" + policy.id);
      },
    },
  ];

  const handleToggleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const getPolicyTableData = (policies) => {
    return policies
      .map((policy) => {
        return {
          policyId: policy.id,
          audienceId: policy.audience?.id,
          policyName: policy.Name,
          deviceCount: policy.members?.length ?? 0,
          policyType:
            policy.complianceChangeRules.length === 0 ? "Manual" : "Automatic",
          action: (
            <div className="btn-toolbar">
              {actionsButtons.map((btn) => (
                <IconButton
                  key={btn.text}
                  text={btn.text}
                  icon={btn.icon}
                  onClick={() => btn.onClick(policy)}
                />
              ))}
              {policy.members?.length == 0 ? (
                <IconButton
                  key={"Delete"}
                  text={"Delete"}
                  icon={<BsFillTrashFill className="mr-2 ml-1 mb-1" />}
                  onClick={() => {
                    setSelectedPolicyToDelete(policy.id);
                    setShowDeleteModal(true);
                  }}
                />
              ) : (
                <IconButton
                  key={"Delete"}
                  text={"Delete"}
                  icon={<BsFillTrashFill className="mr-2 ml-1 mb-1" />}
                  toolTipMessage="Device Count must be 0"
                  isDisabled={true}
                />
              )}
            </div>
          ),
        };
      })
      .reverse();
  };

  useEffect(() => {
    setPolicyTableData(getPolicyTableData(policies));
  }, [policies]);

  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <>
      <MaterialReactTable
        columns={policiesColumns}
        data={policyTableData}
        enableColumnActions={false}
        enableColumnFilters={false}
        enablePagination={true}
        enableSorting={true}
        enableTopToolbar={true}
        initialState={{
          columnVisibility: { policyId: false, audienceId: false },
        }}
        muiTableBodyRowProps={{ hover: false }}
      />

      <DeleteModal
        isDeleteModalOpen={showDeleteModal}
        policyId={selectedPolicyToDelete}
        toggleModal={handleToggleDeleteModal}
        refreshPolicyData={refreshPolicyData}
      />
    </>
  );
};
