import { useEffect, useState } from "react";
import { Button, Card, message } from "antd";
import Spinner from "../../utils/Spinner";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  DeletePolicy,
  GetPolicies,
  UpdatePoliciesOrder,
} from "../../services/hrPolicyAPI";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchPolicies } from "../../redux/actions/hrPolicyActions";
import Policy from "./Policy";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { IPolicy } from "../../types/IPolicy";
import ModalCard from "../../utils/ModalCard";

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
  const { policies } = useSelector((state: RootState) => state.policy);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [orderedPolicies, setOrderedPolicies] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePolicyId, setDeletePolicyId] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const isAdmin = user?.admin;

  useEffect(() => {
    const fetchPolicyData = async () => {
      setLoading(true);
      try {
        await GetPolicies();
        dispatch(fetchPolicies());
      } catch {
        console.error("Failed to fetch policies");
      } finally {
        setLoading(false);
      }
    };
    fetchPolicyData();
  }, [dispatch]);

  useEffect(() => {
    setOrderedPolicies([...policies]);
  }, [policies]);

  const handleDelete = (id) => {
    setDeletePolicyId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (deletePolicyId && (await DeletePolicy(deletePolicyId))) {
      dispatch(fetchPolicies());
      message.success("Policy Deleted Successfully");
    }
    setDeleteModalOpen(false);
  };

  const showModal = () => {
    setIsEditMode(false);
    setSelectedPolicy(null);
    setIsModalOpen(true);
  };

  const handleEdit = (policy) => {
    setIsEditMode(true);
    setSelectedPolicy(policy);
    setIsModalOpen(true);
  };

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

    try {
      await UpdatePoliciesOrder(payload);
      dispatch(fetchPolicies());
      message.success("Policies Updated Successfully!");
    } catch (error) {
      console.error("Failed to update policy order.", error);
    }
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
            {loading ? (
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
                                    onClick={() => handleEdit(policy)}
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
