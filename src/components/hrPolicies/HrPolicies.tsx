import { useEffect, useMemo, useState } from "react";
import { Button, Card } from "antd";
import Spinner from "../../utils/Spinner";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Policy from "./Policy";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { IPolicy } from "../../types/IPolicy";
import ModalCard from "../../utils/ModalCard";
import { ConfigProvider } from "antd";

import {
  deletePilicyHook,
  editHook,
  policiesHook,
  updatePoliciesOrderHook,
} from "../../Hooks/hrPoliciesHook";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const getItemStyle = (draggableStyle) => ({
  marginBottom: "24px",
  background: "#3c3c3c46",
  backdropFilter: "blur(12px)",
  ...draggableStyle,
});

const HrPolicies = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [orderedPolicies, setOrderedPolicies] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePolicyId, setDeletePolicyId] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.admin;
  ConfigProvider.config({
    holderRender: (children) => children,
  });

  const { data: policies = [], isLoading } = policiesHook();
  const stablepolicies = useMemo(() => policies, [JSON.stringify(policies)]);
  useEffect(() => {
    setOrderedPolicies([...policies]);
  }, [stablepolicies]);

  const deleteMutation = deletePilicyHook();

  const UpdateOrderMutation = updatePoliciesOrderHook();

  const handleDelete = (id) => {
    setDeletePolicyId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (deletePolicyId) {
      deleteMutation.mutate(deletePolicyId);
    }
    setDeleteModalOpen(false);
  };

  const showModal = () => {
    setIsEditMode(false);
    setSelectedPolicy(null);
    setIsModalOpen(true);
  };

  const handleEdit = editHook(setIsEditMode, setSelectedPolicy, setIsModalOpen);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const updatedPolicies: IPolicy[] = reorder(
      orderedPolicies,
      result.source.index,
      result.destination.index
    );

    setOrderedPolicies(updatedPolicies);

    const payload = updatedPolicies.map((policy: IPolicy, index) => ({
      policyId: policy._id,
      priority: index,
    }));
    UpdateOrderMutation.mutate(payload);
  };

  return (
    <>
      {isAdmin && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            margin: "14px 20px",
          }}
        >
          <Button onClick={showModal} type="primary">
            Add Policy
          </Button>
          <Policy
            visible={isModalOpen}
            onClose={handleCancel}
            isEditMode={isEditMode}
            policyData={selectedPolicy}
          />
        </div>
      )}
      <div
        className="ScrollInProgress"
        style={{ height: "calc(100vh - 190px)" }}
      >
        <div style={{ padding: "16px" }}>
          <Card
            className="hrpolicies"
            style={{
              marginBottom: "20px",
              padding: "20px",
              position: "relative",
              height: "calc(100vh - 240px)",
              overflowX: "hidden",
              scrollbarWidth: "none",
            }}
          >
            {isLoading ? (
              <Spinner />
            ) : isAdmin ? (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="policies-list">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {orderedPolicies.map((policy, index) => (
                        <Draggable
                          key={policy._id}
                          draggableId={policy._id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              title={policy.policyTitle}
                              style={getItemStyle(
                                provided.draggableProps.style
                              )}
                              extra={
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "10px",
                                    cursor: "pointer",
                                  }}
                                >
                                  <Button
                                    shape="circle"
                                    icon={<EditOutlined />}
                                    size="small"
                                    onClick={() => handleEdit.mutate(policy)}
                                  />
                                  <Button
                                    shape="circle"
                                    danger
                                    icon={<DeleteOutlined />}
                                    size="small"
                                    onClick={() => handleDelete(policy._id)}
                                  />
                                  <ModalCard
                                    title="Are you sure do you want to delete this policy?"
                                    ModalOpen={deleteModalOpen}
                                    setModalOpen={setDeleteModalOpen}
                                    onOk={confirmDelete}
                                  />
                                </div>
                              }
                            >
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: policy.policyDescription,
                                }}
                              ></div>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <div
                className="ScrollInProgress"
                style={{
                  height: "calc(100vh - 205px)",
                  overflowY: "auto",
                  position: "absolute",
                  right: "0",
                  width: "100%",
                  padding: "0px 20px",
                }}
              >
                {orderedPolicies.map((policy) => (
                  <Card
                    key={policy._id}
                    title={policy.policyTitle}
                    style={{
                      marginBottom: "24px",
                      background: "#3c3c3c46",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    <div
                      style={{ marginLeft: "15px" }}
                      dangerouslySetInnerHTML={{
                        __html: policy.policyDescription,
                      }}
                    ></div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default HrPolicies;
