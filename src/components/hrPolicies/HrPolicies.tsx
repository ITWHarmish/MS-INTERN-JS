import { useEffect, useState } from "react";
import { Button, Card, message, Modal, theme } from "antd";
import Spinner from "../../utils/Spinner";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { DeletePolicy, GetPolicies, UpdatePoliciesOrder } from "../../services/hrPolicyAPI";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchPolicies } from "../../redux/actions/hrPolicyActions";
import Policy from "./Policy";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { IPolicy } from "../../types/IPolicy";


const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const getItemStyle = (draggableStyle) => ({
  marginBottom: "24px",
  ...draggableStyle
});

const HrPolicies = () => {
  const { policies } = useSelector((state: RootState) => state.policy);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [orderedPolicies, setOrderedPolicies] = useState([]);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth)
  const { token } = theme.useToken();


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
    Modal.confirm({
      title: "Are you sure you want to delete this policy?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        if (await DeletePolicy(id)) {
          dispatch(fetchPolicies());
          message.success("Policy Deleted Successfully");
        }
      }
    });
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
      priority: index
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
      {isAdmin &&
        < div style={{ display: "flex", justifyContent: "flex-end", margin: "14px 20px" }}>
          <Button onClick={showModal} type="primary">
            Add Policy
          </Button>
          <Policy visible={isModalOpen} onClose={handleCancel} isEditMode={isEditMode} policyData={selectedPolicy} />
        </div >
      }
      <div style={{ padding: "16px", height: "100vh", backgroundColor: token.colorBgLayout === "White" ? "white" : "black" }}>
        <Card style={{ marginBottom: "50px", padding: "20px" }}>
          {loading ? (
            <Spinner />
          ) : (
            isAdmin ? (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="policies-list">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} >
                      {orderedPolicies.map((policy, index) => (
                        <Draggable key={policy._id} draggableId={policy._id.toString()} index={index}>
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              title={policy.policyTitle}
                              style={getItemStyle(provided.draggableProps.style)}
                              extra={
                                <div style={{ display: "flex", gap: "10px", cursor: "pointer" }}>
                                  <Button shape="circle" icon={<EditOutlined />} size="small" onClick={() => handleEdit(policy)} />
                                  <Button shape="circle" danger icon={<DeleteOutlined />} size="small" onClick={() => handleDelete(policy._id)} />
                                </div>
                              }
                            >
                              <div dangerouslySetInnerHTML={{ __html: policy.policyDescription }}></div>
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
              <div>
                {orderedPolicies.map((policy) => (
                  <Card key={policy._id} title={policy.policyTitle} style={{ marginBottom: "24px" }}>
                    <div dangerouslySetInnerHTML={{ __html: policy.policyDescription }}></div>
                  </Card>
                ))}
              </div>
            )
          )}
        </Card>
      </div>
    </>
  );
};

export default HrPolicies;
