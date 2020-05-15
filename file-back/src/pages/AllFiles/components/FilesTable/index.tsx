import React from 'react';
import { Card, Table, Button, Search, Dialog, Input, Message, Breadcrumb, Pagination } from '@alifd/next';
import { request } from 'ice';
import {stringify} from 'qs';
import { PDFObject } from 'react-pdfobject'
// import DynamicIcon from '@icedesign/dynamic-icon';
import styles from './index.module.scss';
import Upload from '@/pages/Upload'
import '../../../../fonts/iconfont.js'
@import('../../../../fonts/style.css')

export interface pageListType {
    id: number,
    filesName_id?: number;
    files_id?: number;
    filesName: string;
    fileType?: string;
    fileSize: string;
    uploadTime: string;
    path: string;
}


type FilesTableState = {
    defaultPath: string,
    movePath: string,
    pageList: pageListType[],
    moveList: pageListType[],
    page: number,
    size: number,
    total: number,

    pageMove: number,
    sizeMove: number,
    totalMove: number,

    visibleCreat: boolean,
    filesName: string,

    visibleDelFiles: boolean,

    filesidDel: number | undefined,
    filesNameDel: string,

    visibleDelFile: boolean,
    fileidDel: number | undefined,
    fileNameDel: string,


    pathMap: string[],
    movePathMap: string[],

    visibleRename: boolean,
    reNameSelect: pageListType,
    reNameInput: string

    visibleMove: boolean,
    moveSelect: pageListType,

    visibleThinkMove: boolean,

    records: any[],

    visibleUpload: boolean,

    visibleSee: boolean,
    imgUrl: string,
    showtype: string
};

const imgExtensionName = ['.bmp', '.gif', '.jpg', '.pic', '.png', '.tif']
const videoExtensionName = ['.avi', '.mp4', '.flv']
const musicExtensionName = ['.mp3', '.wav']
const wordExtensionName = ['.doc', '.docx']
const compressionExtensionName = ['.rar', '.zip', '.7z']

class FilesTable extends React.Component<any, FilesTableState> {
    constructor(props: any) {
        super(props);
        this.state = {
            defaultPath: '',

            movePath: '',
            pageList: [],
            page: 1,
            size: 10,
            total: 0,

            pageMove: 1,
            sizeMove: 10,
            totalMove: 0,



            // 新建文件夹
            visibleCreat: false,
            filesName: '',

            // 删除文件夹操作
            visibleDelFiles: false,
            filesidDel: -1,
            filesNameDel: '',

            // 删除文件操作
            visibleDelFile: false,
            fileidDel: -1,
            fileNameDel: '',
            // path数组
            pathMap: [],
            movePathMap: [],

            // 重命名操作
            visibleRename: false,
            reNameSelect: {} as pageListType,
            reNameInput: '',

            /*移动 */
            moveList: [],
            visibleMove: false,
            moveSelect: {} as pageListType,

            visibleThinkMove: false,

            /*表格中被选中的 */
            records: [],

            visibleUpload: false,

            visibleSee: false,
            imgUrl: '',
            showtype: '',
        };
    }

    componentDidMount() {
        this.init('', '')
    }

    /*size转化 */
    getSize = (size: number) => {
        let index = 0;

        const unit: string[] = ['B', 'KB', 'M', 'G']

        while (size > 1024) {
            size = size / 1024
            index++;
        }
        return `${Math.floor(size * 100) / 100}${unit[index]}`
    }
    /*设置icon */
    getTypeClassName = (fileType: string) => {
        if (fileType.toLowerCase() === '.txt') {
            return 'icon-TXT'
        }
        if (fileType.toLowerCase() === '.pdf') {
            return 'icon-pdfwenjian'
        }
        let ExtensionName = 'icon-weizhiwenjian'

        wordExtensionName.map((value: string) => {
            if (fileType.toLowerCase() === value) {
                ExtensionName = 'icon-word'
            }
        })

        imgExtensionName.map((value: string) => {
            if (fileType.toLowerCase() === value) {
                ExtensionName = 'icon-yunpanlogo-2'
            }
        })
        videoExtensionName.map((value: string) => {
            if (fileType.toLowerCase() === value) {
                ExtensionName = 'icon-yunpanlogo-1'
            }
        })
        musicExtensionName.map((value: string) => {
            if (fileType.toLowerCase() === value) {
                ExtensionName = 'icon-yinlewenjian'
            }
        })
        compressionExtensionName.map((value: string) => {
            if (fileType.toLowerCase() === value) {
                ExtensionName = 'icon-yunpanlogo-'
            }
        })

        return ExtensionName


    }
    /*时间转化 */
    timeStr = (value: string) => {
        const newTime = new Date(value);
        return `${newTime.getFullYear()}
        -${(newTime.getMonth() + 1).toString().padStart(2, "0")}-
        ${newTime.getDate().toString().padStart(2, "0")}
         ${newTime.getHours().toString().padStart(2, "0")}:
         ${newTime.getMinutes().toString().padStart(2, "0")}:
         ${newTime.getSeconds().toString().padStart(2, "0")}`;
    };

    init = async (path: string = '', url: string, keyValue?: string) => {
        const data = await request({
            url: `/msg${url}`,
            method: 'GET',
            params: { name: sessionStorage.getItem('username'), size: this.state.size, page: this.state.page, path: path, keyValue: keyValue }
        })
        let newList: pageListType[] = [];

        // console.log(data)
        let id: number = 1

        data.msg.map((item: any, index: number) => {
            if (item.fileType) {
                newList.push({
                    id: id,
                    files_id: item.files_id,
                    filesName: item.filesName,
                    fileType: item.fileType,
                    fileSize: this.getSize(item.fileSize),
                    uploadTime: item.uploadTime,
                    path: item.last_path
                })
                id++
            } else {
                newList.push({
                    id: id,
                    filesName_id: item.filesName_id,
                    filesName: item.filesName,
                    fileSize: '-',
                    uploadTime: '-',
                    path: item.last_path
                })
                id++
            }
        })

        console.log(data.total)
        this.setState({
            pageList: newList,
            total: data.total
        })

    }

    //下载
    download = (dataIndex: pageListType) => {
        window.location.href = `http://localhost:9000/updown/save?files_id=${dataIndex.files_id}`
    }

    // 搜索
    search = (value: string) => {
        if (value === '') {
            this.init(this.state.defaultPath, '')
        } else {
            this.init(this.state.defaultPath, '/select', value)
        }

    }
    /*进入文件夹 */
    initNewTable = (filesName: string) => {
        const oldPath = this.state.defaultPath
        const newPath = `${oldPath}/${filesName}`
        let pathMap = new Array(); //定义一数组
        pathMap = newPath.split("/").splice(1); //字符分割
        this.setState({
            defaultPath: newPath,
            pathMap: pathMap
        }, () => {
            this.init(this.state.defaultPath, '')
        })
    }
    /*进入移动文件夹 */
    initMoveTable = (filesName: string) => {
        const oldPath = this.state.movePath
        const newPath = `${oldPath}/${filesName}`
        let pathMap = new Array(); //定义一数组
        pathMap = newPath.split("/").splice(1); //字符分割
        this.setState({
            movePath: newPath,
            movePathMap: pathMap
        }, () => {
            this.initMove(this.state.movePath)
        })
    }
    /*新建文件夹开关 */
    onCloseCreat = () => {
        this.setState({ visibleCreat: false, filesName: '' })
    }

    creatFiles = async () => {
        if (this.state.filesName === '') {
            Message.error('文件夹名不能为空')
        } else {
            const data = await request({
                url: `/files/creat`,
                method: 'GET',
                params: { user_id: sessionStorage.getItem('user_id'), filesName: this.state.filesName, last_path: this.state.defaultPath }
            })
            if (data.code === 200) {
                this.init(this.state.defaultPath, '')
                this.setState({ visibleCreat: false, filesName: '' })
            }

        }
    }
    /*新建文件夹的input */
    setFilesName = (value: string) => {
        this.setState({
            filesName: value
        })
    }

    /*删除文件夹 */
    onClosedel = () => {
        this.setState({
            visibleDelFiles: false,
            filesidDel: -1,
            filesNameDel: '',
        })
    }
    delFiles = async () => {
        const path = `${this.state.defaultPath}/${this.state.filesNameDel}`
        const data = await request({
            url: `/files/del`,
            method: 'POST',
            data: stringify({
                filesName_id: this.state.filesidDel,
                name: sessionStorage.getItem('username'),
                lastPath: path
            })
        })
        if (data.code === 200) {
            Message.success('删除成功')
            this.init(this.state.defaultPath, '')
            this.setState({
                visibleDelFiles: false,
                filesidDel: -1,
                filesNameDel: '',
            })
        }
    }
    // 删除文件
    onClosedelFile = () => {
        this.setState({
            visibleDelFile: false,
            fileidDel: -1,
            fileNameDel: '',
        })
    }

    delFile = async () => {
        const data = await request({
            url: `/files/delFile`,
            method: 'POST',
            data: stringify({
                files_id: this.state.fileidDel,
            })
        })
        if (data.code === 200) {
            Message.success('删除成功')
            this.init(this.state.defaultPath, '')
            this.setState({
                visibleDelFile: false,
                fileidDel: -1,
                fileNameDel: '',
            })
        }
    }
    // 重命名
    onCloseRename = () => {
        this.setState({
            visibleRename: false,
            reNameSelect: {
                id: -1,
                filesName_id: -1,
                files_id: -1,
                filesName: '',
                fileSize: '',
                uploadTime: '',
                path: ''
            },
            reNameInput: '',
        })
    }
    reName = async () => {
        if (this.state.reNameInput !== '') {
            const path = `${this.state.defaultPath}/${this.state.reNameSelect.filesName}`
            const data = await request({
                url: `/files/reName`,
                method: 'POST',
                data: stringify({
                    user_id: sessionStorage.getItem('user_id'),
                    files_id: this.state.reNameSelect.files_id,
                    filesName_id: this.state.reNameSelect.filesName_id,
                    newName: this.state.reNameInput,
                    lastPath: path,
                    last_path: this.state.reNameSelect.path,
                })
            })
            if (data.code === 200) {
                Message.success('重命名成功')
                this.init(this.state.defaultPath, '')
                this.setState({
                    visibleRename: false,
                    reNameSelect: {
                        id: -1,
                        filesName_id: -1,
                        files_id: -1,
                        filesName: '',
                        fileSize: '',
                        uploadTime: '',
                        path: ''
                    },
                    reNameInput: '',
                })
            }
        } else {
            Message.error('不能把文件/文件夹命名为空')
        }


    }
    //移动
    onCloseMove = () => {
        this.setState({
            visibleMove: false,
            moveSelect: {
                id: -1,
                filesName_id: -1,
                files_id: -1,
                filesName: '',
                fileSize: '',
                uploadTime: '',
                path: ''
            },
        })
    }
    move = async () => {
        let filePath = ''
        if (this.state.moveSelect.files_id) {
            filePath = this.state.movePath
            if (filePath === this.state.moveSelect.path) {
                Message.error('不能将文件移动到自身或其子目录下')
            } else {
                this.setState({
                    visibleThinkMove: true
                })
            }
        } else {
            filePath = `${this.state.moveSelect.path}/${this.state.moveSelect.filesName}`

            if (this.state.movePath.substring(0, filePath.length) === filePath || this.state.movePath === this.state.moveSelect.path) {
                Message.error('不能将文件移动到自身或其子目录下')
            } else {
                this.setState({
                    visibleThinkMove: true
                })
            }
        }
    }

    moveLast = async () => {
        const path = `${this.state.defaultPath}/${this.state.moveSelect.filesName}`
        const data = await request({
            url: `/files/move`,
            method: 'POST',
            data: stringify({
                user_id: sessionStorage.getItem('user_id'),
                files_id: this.state.moveSelect.files_id,
                filesName_id: this.state.moveSelect.filesName_id,
                newPath: this.state.movePath,
                oldPath: path,
                filesName: this.state.moveSelect.filesName,
            })
        })

        if (data.code === 200) {
            Message.success('移动成功')
            this.init(this.state.defaultPath, '')
            this.setState({
                visibleMove: false,
                visibleThinkMove: false
            })
        }
    }

    onCloseThinkMove = () => {
        this.setState({
            visibleThinkMove: false
        })
    }

    /*跳转到指定文件夹 */
    callTo = (index: number) => {
        let toPath = '';
        let newPathMap: string[] = []
        this.state.pathMap.map((value: any, i: number) => {
            if (i <= index) {
                toPath += `/${value}`
                newPathMap.push(value)
            }
        })

        this.setState({
            defaultPath: toPath,
            pathMap: newPathMap
        }, () => this.init(toPath, ''))

    }
    /*返回最初的文件夹 */
    back = () => {
        this.setState({
            defaultPath: '',
            pathMap: []
        }, () => {
            this.init('', '')
        })
    }
    /*返回上级 */
    callbackLv = () => {
        let toPath = '';
        let newPathMap: string[] = this.state.pathMap.splice(0, this.state.pathMap.length - 1)
        console.log(newPathMap)
        newPathMap.map((value: any, i: number) => {
            toPath += `/${value}`
        })

        this.setState({
            defaultPath: toPath,
            pathMap: newPathMap
        }, () => this.init(toPath, ''))
    }
    /*跳转到指定文件夹Move */
    callToMove = (index: number) => {
        let toPath = '';
        let newPathMap: string[] = []
        this.state.movePathMap.map((value: any, i: number) => {
            if (i <= index) {
                toPath += `/${value}`
                newPathMap.push(value)
            }
        })

        this.setState({
            movePath: toPath,
            movePathMap: newPathMap
        }, () => this.initMove(toPath))

    }
    /*返回最初的文件夹Move */
    backMove = () => {
        this.setState({
            movePath: '',
            movePathMap: []
        }, () => {
            this.initMove('')
        })
    }
    /*返回上级Move */
    callbackLvMove = () => {
        let toPath = '';
        let newPathMap: string[] = this.state.pathMap.splice(0, this.state.pathMap.length - 1)
        console.log(newPathMap)
        newPathMap.map((value: any, i: number) => {
            toPath += `/${value}`
        })

        this.setState({
            movePath: toPath,
            movePathMap: newPathMap
        }, () => this.initMove(toPath))
    }

    initMove = async (path) => {
        const data = await request({
            url: `/msg/onlyFiles`,
            method: 'POST',
            data: stringify({ name_id: sessionStorage.getItem('user_id'), size: this.state.sizeMove, page: this.state.pageMove, path: path })
        })
        let newList: pageListType[] = [];

        let id: number = 0

        data.msg.map((item: any, index: number) => {
            newList.push({
                id: id,
                filesName_id: item.filesName_id,
                filesName: item.filesName,
                fileSize: '-',
                uploadTime: '-',
                path: item.last_path
            })
            id++
        })

        this.setState({
            moveList: newList,
            totalMove: data.total
        })

    }

    moveInit = (dataIndex: pageListType) => {
        this.setState({
            movePath: '',
            movePathMap: [],
            visibleMove: true,
            moveSelect: dataIndex,
        }, () => this.initMove(this.state.movePath))
    }


    onCloseUpload = () => {
        this.setState({
            visibleUpload: false
        })
    }


    pageChange = (value) => {
        console.log(value)
        this.setState({
            page: value
        }, () => {
            this.init('', '')
        })
    }

    show = (id, type) => {

        imgExtensionName.map((value: string) => {
            if (type.toLowerCase() === value) {
                this.setState({
                    imgUrl: `http://localhost:9000/see/show?files_id=${id}`,
                    visibleSee: true,
                    showtype: 'img',
                })
            }
        })


        if (type.toLowerCase() === '.pdf') {
            this.setState({
                imgUrl: `http://localhost:9000/see/show?files_id=${id}`,
                visibleSee: true,
                showtype: 'pdf',
            })
        }


    }

    onCloseSee = () => {
        this.setState({
            imgUrl: '',
            visibleSee: false,
        })
    }

    render() {
        /*table中的时间 */
        const renderTime = (value: string) => {
            if (value !== '-') {
                return this.timeStr(value)
            } else {
                return value
            }
        }
        /*table中的文件名 */
        const name = (rowIndex: Number, colIndex: Number, dataIndex: pageListType) => {
            if (dataIndex.fileType) {

                return (<div className={styles.filesName} onClick={() => this.show(dataIndex.files_id, dataIndex.fileType)}>
                    <svg className={styles.menuIcon} aria-hidden="true">
                        <use xlinkHref={`#${this.getTypeClassName(dataIndex.fileType)}`} />
                    </svg>
                    {dataIndex.filesName} {dataIndex.fileType}</div >)
            }
            return (<div className={styles.filesName} onDoubleClick={() => this.initNewTable(dataIndex.filesName)}> <svg className={styles.menuIcon} aria-hidden="true">
                <use xlinkHref="#icon--folder-empty3" />
            </svg>
                {dataIndex.filesName} </div >)
        }

        /**移动table的文件名 */
        const moveName = (value: string) => {
            return (<div className={styles.filesName} onDoubleClick={() => this.initMoveTable(value)}> <svg className={styles.menuIcon} aria-hidden="true">
                <use xlinkHref="#icon--folder-empty3" />
            </svg>
                {value} </div >)
        }

        /*table中的操作 */
        const renderDo = (rowIndex: Number, colIndex: Number, dataIndex: pageListType) => {
            /*如果有文件id则删除文件 */
            let domDel: any = ''
            let dowLoad: any = ''
            if (dataIndex.files_id) {
                domDel = <Button size='small' warning type='primary'
                    onClick={() => this.setState({ visibleDelFile: true, fileidDel: dataIndex.files_id, fileNameDel: dataIndex.filesName })}>删除</Button>

                dowLoad = <Button
                    size='small'
                    style={{ marginRight: 10 }}
                    type='primary'
                    onClick={() => this.download(dataIndex)}

                >下载</Button>

            } else {
                domDel = <Button size='small' warning type='primary'
                    onClick={() =>
                        this.setState({
                            visibleDelFiles: true,
                            filesidDel: dataIndex.filesName_id,
                            filesNameDel: dataIndex.filesName
                        })}>删除</Button>
            }
            return (
                <>
                    <Button
                        size='small'
                        style={{ marginRight: 10 }}
                        type='primary'
                        onClick={() => this.setState({ visibleRename: true, reNameSelect: dataIndex })}
                    >重命名</Button>

                    <Button
                        size='small'
                        style={{ marginRight: 10 }}
                        type='primary'
                        onClick={() => this.moveInit(dataIndex)}

                    >移动</Button>
                    {dowLoad}
                    {domDel}
                </>
            )
        }


        return (
            <Card free>
                <Card.Content
                    className={styles.SettingPersonBlock}

                >
                    <div className={styles.head}>
                        <div>
                            <Search shape="simple" style={{ width: 200 }} onSearch={(value: string) => this.search(value)} />
                        </div>
                        <div>
                            <Button type="secondary" style={{ marginRight: 10 }} onClick={() => this.setState({ visibleUpload: true })}>上传</Button>
                            <Button type="secondary" style={{ marginRight: 10 }} onClick={() => this.setState({ visibleCreat: true })}> + 新建文件夹</Button>
                        </div>

                    </div>

                    {/* 进入不同级别文件夹控制 */}
                    <div >
                        {
                            this.state.defaultPath !== '' ?
                                <div className={styles.filesRouter}>
                                    <div className={styles.goBack} onClick={() => this.callbackLv()}>返回上级</div>
                                    <div >|</div>
                                    <div className={styles.now}>
                                        <div style={{ cursor: 'auto' }}>当前位置：</div>
                                        <Breadcrumb>
                                            <Breadcrumb.Item onClick={() => this.back()}>全部文件</Breadcrumb.Item>
                                            {
                                                this.state.pathMap.map((v: any, index: any) => (
                                                    <Breadcrumb.Item key={index} onClick={() => this.callTo(index)}>
                                                        {v}
                                                    </Breadcrumb.Item>
                                                ))
                                            }

                                        </Breadcrumb>
                                    </div>
                                </div>
                                : ''
                        }

                    </div>

                    <Table
                        dataSource={this.state.pageList}
                        hasBorder={false}
                    >
                        <Table.Column title="文件名" dataIndex="filesName"
                            cell={(rowIndex: Number, colIndex: Number, dataIndex: pageListType) =>
                                name(rowIndex, colIndex, dataIndex)} />
                        <Table.Column title="大小" dataIndex="fileSize" />
                        <Table.Column title="修改日期" dataIndex="uploadTime" cell={renderTime} />
                        <Table.Column title="操作" dataIndex="uploadTime"
                            cell={(rowIndex: Number, colIndex: Number, dataIndex: pageListType) =>
                                renderDo(rowIndex, colIndex, dataIndex)}
                        />
                    </Table>

                    {/* 翻页器 */}
                    <div style={{ textAlign: "right", marginTop: 10 }}>
                        <Pagination
                            current={this.state.page}
                            total={this.state.total * this.state.size}
                            shape="no-border"
                            type="simple"
                            onChange={(value) => this.pageChange(value)} />
                    </div>

                    {/*  新建文件夹*/}
                    <Dialog
                        title="新建文件夹"
                        visible={this.state.visibleCreat}
                        onOk={() => this.creatFiles()}
                        onCancel={() => this.onCloseCreat()}
                        onClose={() => this.onCloseCreat()}

                    >
                        <Input onChange={(value: string) => this.setFilesName(value)} value={this.state.filesName} />
                    </Dialog>

                    {/*  删除文件夹*/}
                    <Dialog
                        title="删除文件夹"
                        visible={this.state.visibleDelFiles}
                        onOk={() => this.delFiles()}
                        onCancel={() => this.onClosedel()}
                        onClose={() => this.onClosedel()}

                    >
                        您确定要删除文件夹{this.state.filesNameDel}及其中的所有内容吗？
                    </Dialog>

                    {/*  删除文件*/}
                    <Dialog
                        title="删除文件"
                        visible={this.state.visibleDelFile}
                        onOk={() => this.delFile()}
                        onCancel={() => this.onClosedelFile()}
                        onClose={() => this.onClosedelFile()}

                    >
                        您确定要删除文件{this.state.fileNameDel}？
                    </Dialog>

                    {/*  重命名*/}
                    <Dialog
                        title="重命名"
                        visible={this.state.visibleRename}
                        onOk={() => this.reName()}
                        onCancel={() => this.onCloseRename()}
                        onClose={() => this.onCloseRename()}

                    >
                        <Input onChange={(value: string) => this.setState({ reNameInput: value })} value={this.state.reNameInput} />
                    </Dialog>

                    {/*  移动*/}
                    <Dialog
                        title="移动"
                        visible={this.state.visibleMove}
                        onOk={() => this.move()}
                        onCancel={() => this.onCloseMove()}
                        onClose={() => this.onCloseMove()}

                    >
                        <div >
                            {
                                this.state.movePath !== '' ?
                                    <div className={styles.filesRouter}>
                                        <div className={styles.goBack} onClick={() => this.callbackLvMove()}>返回上级</div>
                                        <div >|</div>
                                        <div className={styles.now}>
                                            <div style={{ cursor: 'auto' }}>当前位置：</div>
                                            <Breadcrumb>
                                                <Breadcrumb.Item onClick={() => this.backMove()}>全部文件</Breadcrumb.Item>
                                                {
                                                    this.state.movePathMap.map((v: any, index: any) => (
                                                        <Breadcrumb.Item key={index} onClick={() => this.callToMove(index)}>
                                                            {v}
                                                        </Breadcrumb.Item>
                                                    ))
                                                }

                                            </Breadcrumb>
                                        </div>
                                    </div>
                                    : ''
                            }
                        </div>

                        <Table
                            dataSource={this.state.moveList}
                            hasBorder={false}
                        >

                            <Table.Column title="文件名" dataIndex="filesName"
                                cell={moveName} />
                            <Table.Column title="大小" dataIndex="fileSize" />
                            <Table.Column title="修改日期" dataIndex="uploadTime" cell={renderTime} />
                        </Table>
                        <div style={{ textAlign: "right", marginTop: 10 }}>
                            <Pagination
                                current={this.state.pageMove}
                                total={this.state.totalMove * this.state.sizeMove}
                                shape="no-border"
                                type="simple"
                                onChange={(value) => this.pageChange(value)} />
                        </div>

                    </Dialog>

                    {/* 移动确认 */}
                    <Dialog
                        title="移动"
                        visible={this.state.visibleThinkMove}
                        onOk={() => this.moveLast()}
                        onCancel={() => this.onCloseThinkMove()}
                        onClose={() => this.onCloseThinkMove()}

                    >
                        您确定要把文件/文件夹移动到{
                            this.state.movePath === '' ? '全部文件（根目录）' : this.state.movePath
                        }下吗？
                    </Dialog>

                    {/* 上传 */}
                    <Dialog
                        title="上传"
                        visible={this.state.visibleUpload}
                        footer={<Button onClick={() => this.onCloseUpload()} type='primary'>关闭</Button>}
                        onClose={() => this.onCloseUpload()}
                        style={{ width: 600 }}
                    >
                        <Upload path={this.state.defaultPath} init={() => this.init(this.state.defaultPath, '')} />
                    </Dialog>

                    {/* 展示 */}
                    <Dialog
                        title="展示"
                        visible={this.state.visibleSee}
                        footer={<Button onClick={() => this.onCloseSee()} type='primary'>关闭</Button>}
                        onClose={() => this.onCloseSee()}
                        style={{ width: 700 }}
                        height={this.state.showtype === 'pdf' ? '500px' : ''}
                        isFullScreen
                    >
                        {
                            this.state.showtype === 'img' ?
                                <img src={this.state.imgUrl} alt="${0}" style={{ width: '100%' }} /> :
                                <PDFObject url={this.state.imgUrl} height="350px" />
                        }

                    </Dialog>
                </Card.Content>
            </Card>
        );



    }
}

export default FilesTable;













