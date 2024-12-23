import { combineReducers } from "redux";
import authReducer from './authReducer'; 

import {
  REQUEST,
  SUCCESS,
  FAILURE,
  VIEWREQUEST,
  VIEWSUCCESS,
  VIEWFAILURE,
  DELETEREQUEST,
  DELETESUCCESS,
  DELETEFAILURE,
  ADD_REQUEST,
  ADD_SUCCESS,
  ADD_FAILURE,
  LIST_REQUEST,
  LIST_SUCCESS,
  LIST_FAILURE,
  DEL_REQUEST,
  DEL_SUCCESS,
  DEL_FAILURE,
  DOC_LIST_REQUEST,
  DOC_LIST_SUCCESS,
  DOC_LIST_FAILURE,
  DOC_USER_LIST_REQUEST,
  DOC_USER_LIST_SUCCESS,
  DOC_USER_LIST_FAILURE,
  DATASET_USER_LIST_REQUEST,
  DATASET_USER_LIST_SUCCESS,
  DATASET_USER_LIST_FAILURE,
  DATASET_USER_ADD_REQUEST,
  DATASET_USER_ADD_SUCCESS,
  DATASET_USER_ADD_FAILURE,
  DATASET_USER_DELETE_REQUEST,
  DATASET_USER_DELETE_SUCCESS,
  DATASET_USER_DELETE_FAILURE,
  LIST_RADIO_REQUEST,
  LIST_RADIO_SUCCESS,
  LIST_RADIO_FAILURE,
  LIST_CHAT_HISTORY_REQUEST,
  LIST_CHAT_HISTORY_SUCCESS,
  LIST_CHAT_HISTORY_FAILURE,
  DEL_CHAT_HISTORY_REQUEST,
  DEL_CHAT_HISTORY_SUCCESS,
  DEL_CHAT_HISTORY_FAILURE,
  EDIT_CHAT_HISTORY_REQUEST,
  EDIT_CHAT_HISTORY_SUCCESS,
  EDIT_CHAT_HISTORY_FAILURE,
  CHAT_HISTORY_CONVERSATION_REQUEST,
  CHAT_HISTORY_CONVERSATION_SUCCESS,
  CHAT_HISTORY_CONVERSATION_FAILURE,
  CHAT_HISTORY_FILTER_REQUEST,
  CHAT_HISTORY_FILTER_SUCCESS,
  CHAT_HISTORY_FILTER_FAILURE,
  QNA_CHAT_REQUEST,
  QNA_CHAT_SUCCESS,
  QNA_CHAT_FAILURE,
  CREATE_CHAT_REQUEST,
  CREATE_CHAT_SUCCESS,
  CREATE_CHAT_FAILURE,
  SUCCESS_PDFS_REQUEST,
  SUCCESS_PDFS_SUCCESS,
  SUCCESS_PDFS_FAILURE,
} from "../actions/dataConsoleAction";

const initialAddDocState = {
  addDocData: [],
  loading: false,
  error: null,
};

const addDataSetInitialState = {
  addDataSetResponseData: [],
  loading: false,
  error: null,
};

const dataSetinitialState = {
  response: [],
  loadings: false,
  errors: null,
};

const deleteSetinitialState = {
  responseDelete: [],
  loadings: false,
  errors: null,
};

const dataSetinitialRadioState = {
  responseRadioDataList: [],
  loadings: false,
  errors: null,
};

const chatHistoryInitialState = {
  responseChatHistory: [],
  loadingsChatHistory: false,
  errorsChatHistory: null,
};

const addDocReducer = (state = initialAddDocState, action) => {
  switch (action.type) {
    case REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case SUCCESS:
      return {
        ...state,
        loading: false,
        addDocData: action.payload,
      };
    case FAILURE:
      return {
        ...state,
        loading: false,
        addDocData: action.payload,
        error: action.payload,
      };
    default:
      return state;
  }
};

const initialGetDocState = {
  docListData: [],
  loading: false,
  error: null,
};

const getDocReducer = (state = initialGetDocState, action) => {
  switch (action.type) {
    case DOC_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DOC_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        docListData: action.payload,
      };
    case DOC_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        docListData: action.payload,
        error: action.payload,
      };
    default:
      return state;
  }
};

const initialDltFileState = {
  deleteData: [],
  loading: false,
  error: null,
};

const dltFileReducer = (state = initialDltFileState, action) => {
  switch (action.type) {
    case DELETEREQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETESUCCESS:
      return {
        ...state,
        loading: false,
        deleteData: action.payload,
      };
    case DELETEFAILURE:
      return {
        ...state,
        loading: false,
        deleteData: action.payload,
        error: action.payload,
      };
    default:
      return state;
  }
};

const initialViewFileState = {
  viewData: [],
  loading: false,
  error: null,
};

const viewFileReducer = (state = initialViewFileState, action) => {
  switch (action.type) {
    case VIEWREQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case VIEWSUCCESS:
      return {
        ...state,
        loading: false,
        viewData: action.payload,
      };
    case VIEWFAILURE:
      return {
        ...state,
        loading: false,
        viewData: action.payload,
        error: action.payload,
      };
    default:
      return state;
  }
};

const addReducer = (state = addDataSetInitialState, action) => {
  switch (action.type) {
    case ADD_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADD_SUCCESS:
      return {
        ...state,
        loading: false,
        addDataSetResponseData: action.payload,
      };
    case ADD_FAILURE:
      return {
        ...state,
        loading: false,
        addDataSetResponseData: action.payload,
        error: action.payload,
      };
    default:
      return state;
  }
};

const listDatasetReducer = (state = dataSetinitialState, action) => {
  switch (action.type) {
    case LIST_REQUEST:
      return {
        ...state,
        loadings: true,
        errors: null,
      };
    case LIST_SUCCESS:
      return {
        ...state,
        loadings: false,
        response: action.payload,
      };
    case LIST_FAILURE:
      return {
        ...state,
        loadings: false,
        response: action.payload,
        errors: action.payload,
      };
    default:
      return state;
  }
};

const deleteDataSetReducer = (state = deleteSetinitialState, action) => {
  switch (action.type) {
    case DEL_REQUEST:
      return {
        ...state,
        loadings: true,
        errors: null,
      };
    case DEL_SUCCESS:
      return {
        ...state,
        loadings: false,
        responseDelete: action.payload,
      };
    case DEL_FAILURE:
      return {
        ...state,
        loadings: false,
        responseDelete: action.payload,
        errors: action.payload,
      };
    default:
      return state;
  }
};

const initialDocUserState = {
  documentUserListData: [],
  loading: false,
  error: null,
};

const documentUserList = (state = initialDocUserState, action) => {
  switch (action.type) {
    case DOC_USER_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DOC_USER_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        documentUserListData: action.payload,
      };
    case DOC_USER_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        documentUserListData: action.payload,
        error: action.payload,
      };
    default:
      return state;
  }
};

const initialDatasetUserState = {
  datasetUserListData: [],
  loading: false,
  error: null,
};

const datasetUserList = (state = initialDatasetUserState, action) => {
  switch (action.type) {
    case DATASET_USER_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DATASET_USER_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        datasetUserListData: action.payload,
      };
    case DATASET_USER_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        datasetUserListData: action.payload,
        error: action.payload,
      };
    default:
      return state;
  }
};

const initialAddDatasetUserState = {
  datasetUserAddData: [],
  loading: false,
  error: null,
};

const AddDatasetUser = (state = initialAddDatasetUserState, action) => {
  switch (action.type) {
    case DATASET_USER_ADD_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DATASET_USER_ADD_SUCCESS:
      return {
        ...state,
        loading: false,
        datasetUserAddData: action.payload,
      };
    case DATASET_USER_ADD_FAILURE:
      return {
        ...state,
        loading: false,
        datasetUserAddData: action.payload,
        error: action.payload,
      };
    default:
      return state;
  }
};

const initialDeleteDatasetUserState = {
  datasetUserDeleteData: [],
  loading: false,
  error: null,
};

const DeleteDatasetUser = (state = initialDeleteDatasetUserState, action) => {
  switch (action.type) {
    case DATASET_USER_DELETE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DATASET_USER_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        datasetUserDeleteData: action.payload,
      };
    case DATASET_USER_DELETE_FAILURE:
      return {
        ...state,
        loading: false,
        datasetUserDeleteData: action.payload,
        error: action.payload,
      };
    default:
      return state;
  }
};

const listDatasetRadioReducer = (state = dataSetinitialRadioState, action) => {
  switch (action.type) {
    case LIST_RADIO_REQUEST:
      return {
        ...state,
        loadings: true,
        errors: null,
      };
    case LIST_RADIO_SUCCESS:
      return {
        ...state,
        loadings: false,
        responseRadioDataList: action.payload,
      };
    case LIST_RADIO_FAILURE:
      return {
        ...state,
        loadings: false,
        responseRadioDataList: action.payload,
        errors: action.payload,
      };
    default:
      return state;
  }
};

const chatHistoryRed = (state = chatHistoryInitialState, action) => {
  switch (action.type) {
    case LIST_CHAT_HISTORY_REQUEST:
      return {
        ...state,
        loadingsChatHistory: true,
        errorsChatHistory: null,
      };
    case LIST_CHAT_HISTORY_SUCCESS:
      return {
        ...state,
        loadingsChatHistory: false,
        responseChatHistory: action.payload,
      };
    case LIST_CHAT_HISTORY_FAILURE:
      return {
        ...state,
        loadingsChatHistory: false,
        responseChatHistory: action.payload,
        errorsChatHistory: action.payload,
      };
    default:
      return state;
  }
};

const deleteChatHistoryInitialState = {
  deleteChatHistoryResponseData: [],
};
const initialChatHistoryConversation = {
  chatData: [],
  loading: false,
  error: null,
};

const deleteChatHistory = (state = deleteChatHistoryInitialState, action) => {
  switch (action.type) {
    case DEL_CHAT_HISTORY_REQUEST:

    case DEL_CHAT_HISTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        deleteChatHistoryResponseData: action.payload,
      };
    case DEL_CHAT_HISTORY_FAILURE:
      return {
        ...state,
        loading: false,
        deleteChatHistoryResponseData: action.payload,
        error: action.payload,
      };
    default:
      return state;
  }
};

const editChatHistoryInitialState = {
  editData: [],
  loading: false,
  error: null,
};

const editChatHistory = (state = editChatHistoryInitialState, action) => {
  switch (action.type) {
    case EDIT_CHAT_HISTORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case EDIT_CHAT_HISTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        editData: action.payload,
      };
    case EDIT_CHAT_HISTORY_FAILURE:
      return {
        ...state,
        loading: false,
        editData: action.payload,
      };
    default:
      return state;
  }
};

const ChatHistoryConversation = (
  state = initialChatHistoryConversation,
  action
) => {
  switch (action.type) {
    case CHAT_HISTORY_CONVERSATION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CHAT_HISTORY_CONVERSATION_SUCCESS:
      return {
        ...state,
        loading: false,
        chatData: action.payload,
      };
    case CHAT_HISTORY_CONVERSATION_FAILURE:
      return {
        ...state,
        loading: false,
        chatData: action.payload,
        error: action.payload,
      };
    default:
      return state;
  }
};

const chatHistoryFilterInitialState = {
  filterData: [],
  loading: false,
  error: null,
};
const qnaChatInitialState = {
  qnaData: [],
  loading: false,
  error: null,
};

const chatHistoryFilterData = (
  state = chatHistoryFilterInitialState,
  action
) => {
  switch (action.type) {
    case CHAT_HISTORY_FILTER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case CHAT_HISTORY_FILTER_SUCCESS:
      return {
        ...state,
        filterData: action.payload,
        loading: false,
        error: null,
      };
    case CHAT_HISTORY_FILTER_FAILURE:
      return {
        ...state,
        filterData: action.payload,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

const qnaChatBot = (state = qnaChatInitialState, action) => {
  switch (action.type) {
    case QNA_CHAT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case QNA_CHAT_SUCCESS:
      return {
        ...state,
        loading: false,
        qnaData: action.payload,
      };
    case QNA_CHAT_FAILURE:
      return {
        ...state,
        loading: false,
        qnaData: action.payload,
      };
    default:
      return state;
  }
};

const qnaChatHistoryInitialState = {
  chatHistoryData: [],
  loading: false,
  error: null,
};

const qnaChatHistory = (state = qnaChatHistoryInitialState, action) => {
  switch (action.type) {
    case CREATE_CHAT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CREATE_CHAT_SUCCESS:
      return {
        ...state,
        loading: false,
        chatHistoryData: action.payload,
      };
    case CREATE_CHAT_FAILURE:
      return {
        ...state,
        loading: false,
        chatHistoryData: action.payload,
      };
    default:
      return state;
  }
}; 

const successPDFsInitialState = {
  addSuccessPDFsData: [],
  loading: false,
  error: null,
};

const addSuccessPDFs = (state = successPDFsInitialState, action) => {
  switch (action.type) {
    case SUCCESS_PDFS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case SUCCESS_PDFS_SUCCESS:
      return {
        ...state,
        loading: false,
        addSuccessPDFsData: action.payload,
      };
    case SUCCESS_PDFS_FAILURE:
      return {
        ...state,
        loading: false,
        addSuccessPDFsData: action.payload,
      };
    default:
      return state;
  }
}; 

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer, 
  addDocReducer: addDocReducer,
  getDocReducer: getDocReducer,
  dltFileReducer: dltFileReducer,
  viewFileReducer: viewFileReducer,
  addDatasetReducer: addReducer,
  getlistDatasetReducer: listDatasetReducer,
  getdeleteDataSetReducer: deleteDataSetReducer,
  documentUserList: documentUserList,
  datasetUserList: datasetUserList,
  AddDatasetUser: AddDatasetUser,
  DeleteDatasetUser: DeleteDatasetUser,
  listDatasetRadioReducer: listDatasetRadioReducer,
  chatHistoryRed: chatHistoryRed,
  deleteChatHistory: deleteChatHistory,
  editChatHistory: editChatHistory,
  ChatHistoryConversation: ChatHistoryConversation,
  chatHistoryFilterData: chatHistoryFilterData,
  qnaChatBot: qnaChatBot,
  qnaChatHistory: qnaChatHistory,
  addSuccessPDFs:addSuccessPDFs
});

export default rootReducer;
