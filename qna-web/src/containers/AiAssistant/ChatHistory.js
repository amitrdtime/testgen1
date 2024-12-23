// ChatHistory.jsx
import React, { useEffect, useState, useRef } from "react";
import { Input, Modal, Header, Image } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import {
  getRadioDataActionSet,
  getChatHistory,
  deleteChatHistoryData,
  editChatHistoryData,
  ListChatHistoryRequestSuccess,
} from "../../actions/dataConsoleAction";
import "../../styles/AiAssistant.css";
import "../../styles/ChatScreen.css";

const ChatHistory = ({
  dataFromChild,
  filterdataFromChild,
  onClearFilteredFromChild,
  clearFilterFromChild,
  onStartDateClear,
  isFilterPopUpClick,
  handleFilterSort,
  onOutsideClick,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { responseChatHistory } = useSelector(
    (state) => state.chatHistoryRed || {}
  );
  const { responseRadioDataList } = useSelector(
    (state) => state.listDatasetRadioReducer || {}
  );

  const { deleteChatHistoryResponseData } = useSelector(
    (state) => state.deleteChatHistory || {}
  );

  const { editData } = useSelector((state) => state.editChatHistory || {});
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const chatBotQueryParam = queryParams.get("cid");
  const isMounted = useRef(true);
  const isMountedChatHistory = useRef(true);
  const [data, setData] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const [dataset, setDataset] = useState([]);
  const [isDeleteFlag, setIsDeleteFlag] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [chatInputValue, setChatInputValue] = useState("");
  const [isEditSuccess, setIsEditSuccess] = useState(false);
  const [isClearFlag, setIsClearFlag] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [openDeleteBox, setopenDeleteBox] = useState(false);
  const [deleteFlag, setdeleteFlag] = useState(false);
  const [deleteChatName, setDeleteChatName] = useState("");
  const [deleteHistoryId, setDeleteHistoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginedUserName, setloginedUserName] = useState("");
  const [loginedUserType, setloginedUserType] = useState("");
  const currentUserType = useSelector((state) => state.auth.user);
  const userToken = useSelector((state) => state.auth.token);

  const wrapperRef = useRef(null);

  let filterStDate;
  let filterEdDate;
  if (filterdataFromChild && filterdataFromChild.startDate) {
    filterStDate = filterdataFromChild.startDate.split("/");
    filterStDate =
      filterStDate[2] + "-" + filterStDate[1] + "-" + filterStDate[0];

    filterEdDate = filterdataFromChild.endDate.split("/");
    filterEdDate =
      filterEdDate[2] + "-" + filterEdDate[1] + "-" + filterEdDate[0];
  }

  let ui = "";

  useEffect(() => {
    setloginedUserName(userToken.name);
    setloginedUserType(currentUserType);
  }, [currentUserType, userToken]);

  const searchResult = (data, search = "") => {
    let results;

    const groupedData = data.reduce((result, item) => {
      const { ModifiedDate, Chathistoryinfo, ...rest } = item;
      // Convert ModifiedDate to local date
      //const localDate = new Date(ModifiedDate).toLocaleDateString();
      const localDate = moment(
        new Date(ModifiedDate).toLocaleDateString()
      ).format("YYYY-MM-DD");

      // Find the group for the local date
      const dateGroup = result.find((group) => group.localDate === localDate);

      if (dateGroup) {
        // Add Chathistoryinfo to the existing local date group
        dateGroup.Chathistoryinfo.push({
          Datasetname: Chathistoryinfo[0].Datasetname,
          chathistoryname: Chathistoryinfo[0].chathistoryname,
          id: Chathistoryinfo[0].id,
        });
      } else {
        // Create a new local date group
        result.push({
          localDate,
          ...rest,
          Chathistoryinfo: [
            {
              Datasetname: Chathistoryinfo[0].Datasetname,
              chathistoryname: Chathistoryinfo[0].chathistoryname,
              id: Chathistoryinfo[0].id,
            },
          ],
        });
      }

      return result;
    }, []);

    groupedData.sort((a, b) => {
      return new Date(b.localDate) - new Date(a.localDate);
    });

    if (search) {
      const results = groupedData
        .filter((element) =>
          element.Chathistoryinfo.some((subElement) =>
            subElement.chathistoryname
              .toString()
              .toLowerCase()
              .includes(search.toString().toLowerCase())
          )
        )
        .map((element) => {
          let newElt = Object.assign({
            unique_id: element.unique_id,
            ModifiedDate: element.ModifiedDate,
            Chathistoryinfo: element.Chathistoryinfo.filter((searchEl) =>
              searchEl.chathistoryname
                .toString()
                .toLowerCase()
                .includes(search.toString().toLowerCase())
            ),
          });
          return newElt;
        });
      if (results.length > 0) {
        setData(results);
      } else {
        setData([]);
        setLoading(true);
      }
    } else {
      setLoading(false);
      results = groupedData;
      setData(results);
    }
  };

  const getChatHistoryListingData = (dataset) => {
    try {
      const formDataObject = new FormData();
      formDataObject.append(
        "json",
        JSON.stringify({
          data: dataset,
        })
      );
      dispatch(getChatHistory(formDataObject));
    } catch (error) {
      console.error("Error in getting DataSet:", error);
    }
  };

  const chatData = (UserType, userToken) => {
    try {
      const formDataObject = new FormData();
      formDataObject.append(
        "json",
        JSON.stringify({
          email: userToken.extension_UserEmail,
          role: UserType,
          user_id: userToken.oid,
        })
      );
      dispatch(getRadioDataActionSet(formDataObject));
    } catch (error) {
      console.error("Error in getting DataSet:", error);
    }
  };
  const chatHistoryEdit = (id, chat) => {
    setChatInputValue(chat);
    setIsEditable(id);
  };

  useEffect(() => {
    if (isMounted.current || isDeleteFlag || isEditSuccess) {
      chatData(currentUserType, userToken);
      isMounted.current = false;
      setIsDeleteFlag(false);
      setIsEditSuccess(false);
      setIsEditable(false);
    }
    if (
      responseRadioDataList !== undefined &&
      responseRadioDataList.status !== undefined &&
      responseRadioDataList.status === "success"
    ) {
      setDataset(responseRadioDataList.data);
    }
  }, [
    responseRadioDataList,
    isDeleteFlag,
    isEditSuccess,
    currentUserType,
    userToken,
  ]);

  useEffect(() => {
    if (dataset.length > 0) {
      getChatHistoryListingData(dataset);
      isMountedChatHistory.current = false;
    }
  }, [dataset]);

  useEffect(() => {
    if (chatBotQueryParam) {
      getChatHistoryListingData(dataset);
    }
  }, [dataset, chatBotQueryParam]);

  useEffect(() => {
    if (dataFromChild && dataFromChild.length > 0 && clearFilterFromChild) {
      searchResult(dataFromChild, searchInput);
      setIsClearFlag(true);
    } else if (
      filterdataFromChild &&
      clearFilterFromChild &&
      (filterdataFromChild.startDate || filterdataFromChild.endDate)
    ) {
      searchResult(dataFromChild, searchInput);
    } else if (
      responseChatHistory !== undefined &&
      responseChatHistory.length > 0
    ) {
      searchResult(responseChatHistory, searchInput);
    } else {
      setLoading(true);
    }
  }, [dataset, responseChatHistory, dataFromChild, searchInput]);

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      // Click occurred outside the component
      setIsEditable(false);
    }
  };

  useEffect(() => {
    // Attach event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);

    //Detach event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onOutsideClick]);

  const handleView = (id, datasetName) => {
    navigate(`/ai-assistant?c=${datasetName}&cid=${id}`);
  };

  const handleEdit = (e, id) => {
    if (e.key === "Enter") {
      try {
        const deleteChatObject = new FormData();
        deleteChatObject.append(
          "json",
          JSON.stringify({
            newname: e.target.value,
            id: id,
          })
        );
        dispatch(editChatHistoryData(deleteChatObject));
        setIsEditSuccess(true);
      } catch (error) {
        console.error("Error in delete DataSet:", error);
      }
    }
  };

  const handleDelete = async (chatHistoryId, chatName) => {
    setDeleteChatName(chatName);
    setDeleteHistoryId(chatHistoryId);
    setopenDeleteBox(true);
  };

  const actionDeleteChatHistory = async () => {
    setopenDeleteBox(false);
    try {
      const deleteChatObject = new FormData();
      deleteChatObject.append(
        "json",
        JSON.stringify({
          id: deleteHistoryId,
        })
      );
      dispatch(deleteChatHistoryData(deleteChatObject));
      setIsDeleteFlag(true);
    } catch (error) {
      console.error("Error in delete chat History:", error);
    }
  };

  const clearFilter = () => {
    onClearFilteredFromChild(false);
    setIsDeleteFlag(true);
  };

  const handleClose = async () => {
    setopenDeleteBox(false);
  };

  const today = new Date();
  let isToday = false;
  return (
    <div className="chatHistoryLeft">
      {isFilterPopUpClick && clearFilterFromChild ? (
        <>
          <div className="ui card chat-screen filterBox">
            <h5>
              Applied Filters
              <span
                style={{ color: "red", fontSize: "12px", cursor: "pointer" }}
                onClick={clearFilter}
              >
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Clear all
              </span>
            </h5>
            {filterdataFromChild && clearFilterFromChild ? (
              <>
                <div className="filterOuterBox">
                  {filterdataFromChild.startDate ? (
                    <label
                      className="filterData startDate"
                      onClick={() => onStartDateClear({ startDate: null })}
                      value="StartDate"
                      style={{ cursor: "pointer" }}
                    >
                      {moment(filterStDate).format(
                        `${process.env.REACT_APP_DATE_FORMAT}`
                      )}

                      <img
                        src="/images/grey-close.svg"
                        alt="remove filter"
                        class="ui image"
                      ></img>
                    </label>
                  ) : (
                    ""
                  )}

                  {filterdataFromChild.endDate ? (
                    <label
                      className="filterData endDate"
                      onClick={() => onStartDateClear({ endDate: null })}
                      style={{ cursor: "pointer" }}
                    >
                      {moment(filterEdDate).format(
                        `${process.env.REACT_APP_DATE_FORMAT}`
                      )}
                      <img
                        src="/images/grey-close.svg"
                        alt="remove filter"
                        class="ui image"
                      ></img>
                    </label>
                  ) : (
                    ""
                  )}
                </div>

                {filterdataFromChild.datasets &&
                filterdataFromChild.datasets.length > 0 ? (
                  <div className="filterOuterBox">
                    <label
                      className="filterData dataset"
                      onClick={() => onStartDateClear({ datasets: null })}
                      style={{ cursor: "pointer" }}
                    >
                      {filterdataFromChild.datasets
                        ? filterdataFromChild.datasets[0]
                        : ""}
                      <img
                        src="/images/grey-close.svg"
                        alt="remove filter"
                        class="ui image"
                      ></img>
                    </label>

                    {filterdataFromChild.datasets.length > 1 ? (
                      <label
                        className="filterData filterBlue"
                        onClick={handleFilterSort}
                        style={{ cursor: "pointer" }}
                      >
                        {`+ ${parseInt(
                          filterdataFromChild.datasets.length - 1
                        )} more`}
                      </label>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
                )}
              </>
            ) : (
              <></>
            )}
          </div>
        </>
      ) : (
        <></>
      )}

      <div className="ai-chat-history">
        <Input
          fluid
          className="ai-search-input"
          placeholder="Search Chat name"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      <br />

      {loading ? (
        <div className="emptyContainer">
          <Image src="/images/empty-state.svg" alt="Empty State" />
          <p className="emptyMessage">
            <span className="titleMessage">No chats available </span>
          </p>
        </div>
      ) : data && data.length > 0 ? (
        data.map((item, key) => (
          <div className="chatHistoryOuter" key={key}>
            {Array.isArray(item.Chathistoryinfo) &&
            item.Chathistoryinfo !== undefined ? (
              <>
                <h5>
                  &nbsp;
                  {item.localDate === moment(today).format("YYYY-MM-DD")
                    ? "Today"
                    : moment(item.localDate).format(
                        `${process.env.REACT_APP_DATE_FORMAT}`
                      )}
                  &nbsp;({item.Chathistoryinfo.length})
                </h5>
                {item.Chathistoryinfo.map((items, innerKey) => (
                  <div
                    key={innerKey}
                    className={`menu-item-search chatHistory ${
                      isEditable === items.id ? "inputHistory" : ""
                    }`}
                    onMouseOver={() => setIsHovered(items.id)}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    {isEditable === items.id ? (
                      <>
                        <div className="chatHistoryOuter">
                          <label ref={wrapperRef} className="inputChatBox">
                            <input
                              type="text"
                              value={chatInputValue}
                              onChange={(e) =>
                                setChatInputValue(e.target.value)
                              }
                              onKeyPress={(e) => handleEdit(e, items.id)}
                              className="inputChatBoxTxt"
                            />
                          </label>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="chatBox">
                          <label
                            className="chat"
                            onClick={() =>
                              handleView(items.id, items.Datasetname)
                            }
                            style={{ cursor: "pointer" }}
                          >
                            {items.chathistoryname !== undefined
                              ? items.chathistoryname.length < 21
                                ? items.chathistoryname
                                : items.chathistoryname.slice(0, 17) + "..."
                              : ""}
                          </label>
                        </div>
                        {isHovered == items.id ? (
                          <div className="datasetHover">
                            <label className="dataset">
                              <img
                                src="/images/blue-pen.svg"
                                alt="Edit"
                                onClick={() =>
                                  chatHistoryEdit(
                                    items.id,
                                    items.chathistoryname
                                  )
                                }
                                style={{ cursor: "pointer", marginRight: 8 }}
                              />
                              <img
                                src="/images/blue-download.svg"
                                alt="Edit"
                                style={{ cursor: "pointer", marginRight: 8 }}
                              />

                              <img
                                src="/images/red-delete.svg"
                                alt="Delete"
                                onClick={() =>
                                  handleDelete(items.id, items.chathistoryname)
                                }
                                style={{ cursor: "pointer" }}
                              />
                            </label>
                          </div>
                        ) : (
                          <div className="datasetBox">
                            <label className="dataset">
                              {items.Datasetname.length < 11
                                ? items.Datasetname
                                : items.Datasetname.slice(0, 8) + "..."}
                            </label>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <div
                key={item.unique_id}
                className={`menu-item-search chatHistory ${
                  isEditable === item.id ? "inputHistory" : ""
                }`}
                onMouseOver={() => setIsHovered(item.unique_id)}
                onMouseLeave={() => setIsHovered(null)}
              >
                <h5>
                  &nbsp;&nbsp;
                  {item.localDate === moment(today).format("YYYY-MM-DD")
                    ? "Today"
                    : moment(item.localDate).format(
                        `${process.env.REACT_APP_DATE_FORMAT}`
                      )}
                  {item.localDate === moment(today).format("YYYY-MM-DD")
                    ? (isToday = true)
                    : ""}
                </h5>

                {isEditable === item.Chathistoryinfo.id ? (
                  <>
                    <div>
                      <label className="inputChatBox">
                        <input
                          type="text"
                          value={chatInputValue}
                          onChange={(e) => setChatInputValue(e.target.value)}
                          onKeyPress={(e) =>
                            handleEdit(e, item.Chathistoryinfo.id)
                          }
                          className="inputChatBoxTxt"
                        />
                      </label>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="chatBox">
                      {" "}
                      <label
                        className="chat"
                        onClick={() =>
                          handleView(
                            item.Chathistoryinfo.id,
                            item.Chathistoryinfo.Datasetname
                          )
                        }
                      >
                        {item.Chathistoryinfo !== undefined &&
                        item.Chathistoryinfo.chathistoryname !== undefined
                          ? item.Chathistoryinfo.chathistoryname
                          : ""}
                      </label>
                    </div>

                    {isHovered == item.unique_id ? (
                      <div>
                        <label className="dataset">
                          <img
                            src="/images/blue-pen.svg"
                            alt="Edit"
                            onClick={() =>
                              chatHistoryEdit(
                                item.Chathistoryinfo.id,
                                item.Chathistoryinfo.chathistoryname
                              )
                            }
                            style={{ cursor: "pointer", marginRight: 8 }}
                          />
                          <img
                            src="/images/blue-download.svg"
                            alt="Edit"
                            style={{ cursor: "pointer", marginRight: 8 }}
                          />

                          <img
                            src="/images/red-delete.svg"
                            alt="Delete"
                            onClick={() =>
                              handleDelete(
                                item.Chathistoryinfo.id,
                                item.Datasetname
                              )
                            }
                            style={{ cursor: "pointer" }}
                          />
                        </label>
                      </div>
                    ) : (
                      <div className="datasetBox">
                        <label className="dataset">{item.Datasetname}</label>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        ))
      ) : isFilterPopUpClick ? (
        <div className="emptyContainer">
          <Image src="/images/empty-state.svg" alt="Empty State" />
          <p className="emptyMessage">
            <span className="titleMessage">No chats available </span>
          </p>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      <Modal
        open={openDeleteBox}
        onClose={handleClose}
        size="tiny"
        className="add-document-model deletePopup"
      >
        <Modal.Content>
          <Header as="h3">Delete Chat History</Header>

          <p>Are you sure you want to Delete {deleteChatName}</p>
        </Modal.Content>
        <Modal.Actions>
          <button className="cancel-btn" onClick={handleClose}>
            Cancel
          </button>
          <button className="add-btn" onClick={actionDeleteChatHistory}>
            Delete
          </button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default ChatHistory;
