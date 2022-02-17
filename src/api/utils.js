import HTTPREQUEST from "../servers/http"

export const getServices = () => {
    return HTTPREQUEST.get('/scrm-admin/user/getUserListForOrder',{type:1})
}

export const getAllTag = (params) => {
    return HTTPREQUEST.get('/scrm-message/tags/getAllTagsByUserId', params)
}

export const getAllTagNew = (params) => {
    return HTTPREQUEST.get('/scrm-message/tags/getTagsListNew', params)
}

export const getWaAccounts = (params) => {
    return HTTPREQUEST.get('/scrm-whatsapp-message/whatsappAccount/select2List',params)
}

export const getInsAccounts = (params) =>{
    return HTTPREQUEST.get('/scrm-instagram-message/instagramAccount/getPageListForProfile',params)
}

export const getAllPage = () => {
    return HTTPREQUEST.get('/scrm-message/pageConfig/getAllPageBySellerId')
}

export const translateMsg = (params) => {
    return HTTPREQUEST.get(`/scrm-socket/messenging/translate/msg/${params.mid}`)
}

export const translateWaMsg = (params) => {
    return HTTPREQUEST.get(`/scrm-socket/whatsapp/messenging/translate/msg/${params.mid}`)
}

export const translateInsMsg = (params) => {
    return HTTPREQUEST.get(`/scrm-socket/instagram/messenging/translate/msg/${params.mid}`)
}