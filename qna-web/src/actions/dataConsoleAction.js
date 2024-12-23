import {
  addDocument,
  getDocumentDetails,
  deleteDocumentFile,
  downloadDocumentFile,
  addDataSets,
  getDataSet,
  deleteDataSet,
  allDatasetUsers,
  allDocumentUsers,
  addDatasetUsers,
  deleteDocUser,
  getChatHistoryData,
  getRadioDataSets,
  deleteChatHistory,
  editChatHistory,
  getChatHistoryConversationData,
  getChatHistoryByFiltering,
  getQnaChatbotData,
  addChatHistoryData,
  addSuccessPDFsData
} from "../apis";
import axios from "axios";

export const REQUEST = "REQUEST";
export const SUCCESS = "SUCCESS";
export const FAILURE = "FAILURE";
export const VIEWREQUEST = "VIEWREQUEST";
export const VIEWSUCCESS = "VIEWSUCCESS";
export const VIEWFAILURE = "VIEWFAILURE";
export const DELETEREQUEST = "DELETEREQUEST";
export const DELETESUCCESS = "DELETESUCCESS";
export const DELETEFAILURE = "DELETEFAILURE";

//add dataset
export const ADD_REQUEST = "ADD_REQUEST";
export const ADD_SUCCESS = "ADD_SUCCESS";
export const ADD_FAILURE = "ADD_FAILURE";

//list dataset
export const LIST_REQUEST = "LIST_REQUEST";
export const LIST_SUCCESS = "LIST_SUCCESS";
export const LIST_FAILURE = "LIST_FAILURE";

//delete dataset
export const DEL_REQUEST = "DEL_REQUEST";
export const DEL_SUCCESS = "DEL_SUCCESS";
export const DEL_FAILURE = "DEL_FAILURE";

export const DOC_LIST_REQUEST = "DOC_LIST_REQUEST";
export const DOC_LIST_SUCCESS = "DOC_LIST_SUCCESS";
export const DOC_LIST_FAILURE = "DOC_LIST_FAILURE";

export const DOC_USER_LIST_REQUEST = "DOC_USER_LIST_REQUEST";
export const DOC_USER_LIST_SUCCESS = "DOC_USER_LIST_SUCCESS";
export const DOC_USER_LIST_FAILURE = "DOC_USER_LIST_FAILURE";

export const DATASET_USER_LIST_REQUEST = "DATASET_USER_LIST_REQUEST";
export const DATASET_USER_LIST_SUCCESS = "DATASET_USER_LIST_SUCCESS";
export const DATASET_USER_LIST_FAILURE = "DATASET_USER_LIST_FAILURE";

export const DATASET_USER_ADD_REQUEST = "DATASET_USER_ADD_REQUEST";
export const DATASET_USER_ADD_SUCCESS = "DATASET_USER_ADD_SUCCESS";
export const DATASET_USER_ADD_FAILURE = "DATASET_USER_ADD_FAILURE";

export const DATASET_USER_DELETE_REQUEST = "DATASET_USER_DELETE_REQUEST";
export const DATASET_USER_DELETE_SUCCESS = "DATASET_USER_DELETE_SUCCESS";
export const DATASET_USER_DELETE_FAILURE = "DATASET_USER_DELETE_FAILURE";

//list radio dataset
export const LIST_CHAT_HISTORY_REQUEST = "LIST_CHAT_HISTORY_REQUEST";
export const LIST_CHAT_HISTORY_SUCCESS = "LIST_CHAT_HISTORY_SUCCESS";
export const LIST_CHAT_HISTORY_FAILURE = "LIST_CHAT_HISTORY_FAILURE";

export const LIST_RADIO_REQUEST = "LIST_RADIO_REQUEST";
export const LIST_RADIO_SUCCESS = "LIST_RADIO_SUCCESS";
export const LIST_RADIO_FAILURE = "LIST_RADIO_FAILURE";

export const CHAT_HISTORY_CONVERSATION_REQUEST =
  "CHAT_HISTORY_CONVERSATION_REQUEST";
export const CHAT_HISTORY_CONVERSATION_SUCCESS =
  "CHAT_HISTORY_CONVERSATION_SUCCESS";
export const CHAT_HISTORY_CONVERSATION_FAILURE =
  "CHAT_HISTORY_CONVERSATION_FAILURE";

//delete chathistory
export const DEL_CHAT_HISTORY_REQUEST = "DEL_CHAT_HISTORY_REQUEST";
export const DEL_CHAT_HISTORY_SUCCESS = "DEL_CHAT_HISTORY_SUCCESS";
export const DEL_CHAT_HISTORY_FAILURE = "DEL_CHAT_HISTORY_FAILURE";

//edit chathistory
export const EDIT_CHAT_HISTORY_REQUEST = "EDIT_CHAT_HISTORY_REQUEST";
export const EDIT_CHAT_HISTORY_SUCCESS = "DEL_CHAT_HISTORY_SUCCESS";
export const EDIT_CHAT_HISTORY_FAILURE = "DEL_CHAT_HISTORY_FAILURE";

export const CHAT_HISTORY_FILTER_REQUEST = "CHAT_HISTORY_FILTER_REQUEST";
export const CHAT_HISTORY_FILTER_SUCCESS = "CHAT_HISTORY_FILTER_SUCCESS";
export const CHAT_HISTORY_FILTER_FAILURE = "CHAT_HISTORY_FILTER_FAILURE";
export const QNA_CHAT_REQUEST = "QNA_CHAT_REQUEST";
export const QNA_CHAT_SUCCESS = "QNA_CHAT_SUCCESS";
export const QNA_CHAT_FAILURE = "QNA_CHAT_FAILURE";

export const CREATE_CHAT_REQUEST = "CREATE_CHAT_REQUEST";
export const CREATE_CHAT_SUCCESS = "CREATE_CHAT_SUCCESS";
export const CREATE_CHAT_FAILURE = "CREATE_CHAT_FAILURE";

export const SUCCESS_PDFS_REQUEST ="SUCCESS_PDFS_REQUEST";
export const SUCCESS_PDFS_SUCCESS ="SUCCESS_PDFS_SUCCESS";
export const SUCCESS_PDFS_FAILURE ="SUCCESS_PDFS_FAILURE";

export const apiRequest = () => ({
  type: REQUEST,
});

export const requestSuccess = (response) => ({
  type: SUCCESS,
  payload: response,
});

export const requestFailure = (error) => ({
  type: FAILURE,
  payload: error,
});

export const viewRequest = () => ({
  type: VIEWREQUEST,
});

export const requestViewSuccess = (response) => ({
  type: VIEWSUCCESS,
  payload: response,
});

export const requestViewFailure = (error) => ({
  type: VIEWFAILURE,
  payload: error,
});

export const deleteRequest = () => ({
  type: DELETEREQUEST,
});

export const deleteSuccess = (response) => ({
  type: DELETESUCCESS,
  payload: response,
});

export const deleteFailure = (error) => ({
  type: DELETEFAILURE,
  payload: error,
});

export const AddApiRequest = () => ({
  type: ADD_REQUEST,
});

export const AddRequestSuccess = (response) => ({
  type: ADD_SUCCESS,
  payload: response,
});

export const addRequestFailure = (error) => ({
  type: ADD_FAILURE,
  payload: error,
});

export const ListApiRequest = () => ({
  type: LIST_REQUEST,
});

export const ListRequestSuccess = (response) => ({
  type: LIST_SUCCESS,
  payload: response,
});

export const ListRequestFailure = (error) => ({
  type: LIST_FAILURE,
  payload: error,
});

export const DelApiRequest = () => ({
  type: DEL_REQUEST,
});

export const DelRequestSuccess = (response) => ({
  type: DEL_SUCCESS,
  payload: response,
});

export const DelRequestFailure = (error) => ({
  type: DEL_FAILURE,
  payload: error,
});

export const getDocumentRequest = () => ({
  type: DOC_LIST_REQUEST,
});

export const getDocumentSuccess = (response) => ({
  type: DOC_LIST_SUCCESS,
  payload: response,
});

export const getDocumentFailure = (error) => ({
  type: DOC_LIST_FAILURE,
  payload: error,
});

export const AllDocumentUsersDataRequest = () => ({
  type: DOC_USER_LIST_REQUEST,
});

export const AllDocumentUsersDataSuccess = (response) => ({
  type: DOC_USER_LIST_SUCCESS,
  payload: response,
});

export const AllDocumentUsersDataFailure = (error) => ({
  type: DOC_USER_LIST_FAILURE,
  payload: error,
});

export const DatasetUsersDataRequest = () => ({
  type: DATASET_USER_LIST_REQUEST,
});

export const DatasetUsersDataSuccess = (response) => ({
  type: DATASET_USER_LIST_SUCCESS,
  payload: response,
});

export const DatasetUsersDataFailure = (error) => ({
  type: DATASET_USER_LIST_FAILURE,
  payload: error,
});

export const AddDatasetUsersDataRequest = () => ({
  type: DATASET_USER_ADD_REQUEST,
});

export const AddDatasetUsersDataSuccess = (response) => ({
  type: DATASET_USER_ADD_SUCCESS,
  payload: response,
});

export const AddDatasetUsersDataFailure = (error) => ({
  type: DATASET_USER_ADD_FAILURE,
  payload: error,
});

export const DeleteDocumentRequest = () => ({
  type: DATASET_USER_DELETE_REQUEST,
});

export const DeleteDocumentSuccess = (response) => ({
  type: DATASET_USER_DELETE_SUCCESS,
  payload: response,
});

export const DeleteDocumentFailure = (error) => ({
  type: DATASET_USER_DELETE_FAILURE,
  payload: error,
});

export const ListChatHistoryApiRequest = () => ({
  type: LIST_CHAT_HISTORY_REQUEST,
});

export const ListChatHistoryRequestSuccess = (response) => ({
  type: LIST_CHAT_HISTORY_SUCCESS,
  payload: response,
});

export const ListChatHistoryRequestFailure = (error) => ({
  type: LIST_CHAT_HISTORY_FAILURE,
});

export const ListRadioApiRequest = () => ({
  type: LIST_RADIO_REQUEST,
});

export const ListRadioRequestSuccess = (response) => ({
  type: LIST_RADIO_SUCCESS,
  payload: response,
});

export const ListRadioRequestFailure = (error) => ({
  type: LIST_RADIO_FAILURE,
  payload: error,
});

export const DeleteChatHistoryRequest = () => ({
  type: DEL_CHAT_HISTORY_REQUEST,
});

export const DeleteChatHistorySuccess = (response) => ({
  type: DEL_CHAT_HISTORY_SUCCESS,
  payload: response,
});

export const DeleteChatHistoryFailure = (error) => ({
  type: DEL_CHAT_HISTORY_FAILURE,
  payload: error,
});

export const EditChatHistoryRequest = () => ({
  type: EDIT_CHAT_HISTORY_REQUEST,
});

export const EditChatHistorySuccess = (response) => ({
  type: EDIT_CHAT_HISTORY_SUCCESS,
  payload: response,
});

export const EditChatHistoryFailure = (error) => ({
  type: EDIT_CHAT_HISTORY_FAILURE,
  payload: error,
});
export const HistoryConversationRequest = () => ({
  type: CHAT_HISTORY_CONVERSATION_REQUEST,
});
export const HistoryConversationSuccess = (response) => ({
  type: CHAT_HISTORY_CONVERSATION_SUCCESS,
  payload: response,
});

export const HistoryConversationFailure = (error) => ({
  type: CHAT_HISTORY_CONVERSATION_FAILURE,
  payload: error,
});

export const ChatHistoryFilterRequest = () => ({
  type: CHAT_HISTORY_FILTER_REQUEST,
});
export const ChatHistoryFilterSuccess = (response) => ({
  type: CHAT_HISTORY_FILTER_SUCCESS,
  payload: response,
});

export const ChatHistoryFilterFailure = (error) => ({
  type: CHAT_HISTORY_FILTER_FAILURE,
  payload: error,
});
export const QnaChatbotRequest = () => ({
  type: QNA_CHAT_REQUEST,
});
export const QnaChatbotSuccess = (response) => ({
  type: QNA_CHAT_SUCCESS,
  payload: response,
});

export const QnaChatbotFailure = (error) => ({
  type: QNA_CHAT_FAILURE,
  payload: error,
});

export const createChatHistoryDataRequest= () => ({
  type: CREATE_CHAT_REQUEST,
});
export const createChatHistoryDataSuccess = (response) => ({
  type: CREATE_CHAT_SUCCESS,
  payload: response,
});
export const createChatHistoryDataFailure= (error) => ({
  type: CREATE_CHAT_FAILURE,
  payload: error,
});

export const addSuccessPDFsRequest = () => ({
  type: SUCCESS_PDFS_REQUEST,
});

export const addSuccessPDFsSuccess = (response) => ({
  type: SUCCESS_PDFS_SUCCESS,
  payload: response,
});

export const  addSuccessPDFsFailure = (error) => ({
  type: SUCCESS_PDFS_FAILURE,
  payload: error,
});


export const addDocuments = (payload) => {
  return async (dispatch) => {
    dispatch(apiRequest());
    try {
      const response = await addDocument(payload);
      dispatch(requestSuccess(response));
    } catch (error) {
      dispatch(requestFailure("API error"));
    }
  };
};

export const getDocumentsDetails = (payload) => {
  return async (dispatch) => {
    dispatch(getDocumentRequest());
    try {
      const response = await getDocumentDetails(payload);
      dispatch(getDocumentSuccess(response));
    } catch (error) {
      dispatch(getDocumentFailure("API error"));
    }
  };
};

export const dltDocumentFile = (payload) => {
  return async (dispatch) => {
    dispatch(deleteRequest());
    try {
      const response = await deleteDocumentFile(payload);
      dispatch(deleteSuccess(response));
    } catch (error) {
      dispatch(deleteFailure("API error"));
    }
  };
};

export const viewDocumentFile = (payload) => {
  return async (dispatch) => {
    dispatch(viewRequest());
    try {
      const response = await downloadDocumentFile(payload);
      dispatch(requestViewSuccess(response));
    } catch (error) {
      dispatch(requestViewFailure("API error"));
    }
  };
};

export const addDataSet = (payload) => {
  return async (dispatch) => {
    dispatch(AddApiRequest());
    try {
      const response = await addDataSets(payload);
      dispatch(AddRequestSuccess(response));
    } catch (error) {
      dispatch(addRequestFailure("API error"));
    }
  };
};

export const getDatasets = () => {
  return async (dispatch) => {
    dispatch(ListApiRequest());
    try {
      const response = await getDataSet();
      dispatch(ListRequestSuccess(response));
    } catch (error) {
      dispatch(ListRequestFailure("API error"));
    }
  };
};

export const deleteDatasets = (payload) => {
  return async (dispatch) => {
    dispatch(DelApiRequest());
    try {
      const response = await deleteDataSet(payload);
      dispatch(DelRequestSuccess(response));
    } catch (error) {
      dispatch(DelRequestFailure("API error"));
    }
  };
};

export const getAllDocumentUsersData = (payload) => {
  return async (dispatch) => {
    dispatch(AllDocumentUsersDataRequest());
    try {
      const response = await allDocumentUsers(payload);
      dispatch(AllDocumentUsersDataSuccess(response));
    } catch (error) {
      dispatch(AllDocumentUsersDataFailure("API error"));
    }
  };
};

export const getDatasetUsersData = (payload) => {
  return async (dispatch) => {
    dispatch(DatasetUsersDataRequest());
    try {
      const response = await allDatasetUsers(payload);
      dispatch(DatasetUsersDataSuccess(response));
    } catch (error) {
      dispatch(DatasetUsersDataFailure("API error"));
    }
  };
};

export const AddDocumentUsersData = (payload) => {
  return async (dispatch) => {
    dispatch(AddDatasetUsersDataRequest());
    try {
      const response = await addDatasetUsers(payload);
      dispatch(AddDatasetUsersDataSuccess(response));
    } catch (error) {
      dispatch(AddDatasetUsersDataFailure("API error"));
    }
  };
};

export const deleteDocumentUser = (payload) => {
  return async (dispatch) => {
    dispatch(DeleteDocumentRequest());
    try {
      const response = await deleteDocUser(payload);
      dispatch(DeleteDocumentSuccess(response));
    } catch (error) {
      dispatch(DeleteDocumentFailure("API error"));
    }
  };
};

export const getChatHistory = (payload) => {
  return async (dispatch) => {
    dispatch(ListChatHistoryApiRequest());
    try {
      const response = await getChatHistoryData(payload);
      dispatch(ListChatHistoryRequestSuccess(response));
    } catch (error) {
      dispatch(ListChatHistoryRequestFailure("API error"));
    }
  };
};

export const getRadioDataActionSet = (payload) => {
  return async (dispatch) => {
    dispatch(ListRadioApiRequest());
    try {
      const response = await getRadioDataSets(payload);
      dispatch(ListRadioRequestSuccess(response));
    } catch (error) {
      dispatch(ListRadioRequestFailure("API error"));
    }
  };
};

export const deleteChatHistoryData = (payload) => {
  return async (dispatch) => {
    dispatch(DeleteChatHistoryRequest());
    try {
      const response = await deleteChatHistory(payload);
      dispatch(DeleteChatHistorySuccess(response));
    } catch (error) {
      dispatch(DeleteChatHistoryFailure("API error"));
    }
  };
};

export const editChatHistoryData = (payload) => {
  return async (dispatch) => {
    dispatch(EditChatHistoryRequest());
    try {
      const response = await editChatHistory(payload);
      dispatch(EditChatHistorySuccess(response));
    } catch (error) {
      dispatch(EditChatHistoryFailure("API error"));
    }
  };
};

export const getChatHistoryConversation = (payload) => {
  return async (dispatch) => {
    dispatch(HistoryConversationRequest());
    try {
      const response = await getChatHistoryConversationData(payload);
      dispatch(HistoryConversationSuccess(response));
    } catch (error) {
      dispatch(HistoryConversationFailure("API error"));
    }
  };
};

export const getChatHistoryByFilter = (payload) => {
  return async (dispatch) => {
    dispatch(ChatHistoryFilterRequest());
    try {
      const response = await getChatHistoryByFiltering(payload);
      dispatch(ChatHistoryFilterSuccess(response));
    } catch (error) {
      dispatch(ChatHistoryFilterFailure("API_Error"));
    }
  };
};

export const qnaChatbotSession = (payload) => {
  return async (dispatch) => {
    dispatch(QnaChatbotRequest());
    try {
      const response = await getQnaChatbotData(payload);
      dispatch(QnaChatbotSuccess(response));
    } catch (error) {
      dispatch(QnaChatbotFailure("API error"));
    }
  };
};

export const createChatHistoryData = (payload) => {
  return async (dispatch) => {
    dispatch(createChatHistoryDataRequest());
    try {
      const response = await addChatHistoryData(payload);
      dispatch(createChatHistoryDataSuccess(response));
    } catch (error) {
      dispatch(createChatHistoryDataFailure("API error"));
    }
  };
};

export const addSuccessPDFs = (payload) => {
  return async (dispatch) => {
    dispatch(addSuccessPDFsRequest());
    try {
      const response = await addSuccessPDFsData(payload);
      dispatch(addSuccessPDFsSuccess(response));
    } catch (error) {
      dispatch(addSuccessPDFsFailure("API error"));
    }
  };
};

