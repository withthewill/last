import React from 'react';
import { Button, Progress, Table, Message, Icon } from '@alifd/next';
import styles from './index.module.scss';
import Uploader from 'simple-uploader.js'




interface fileListType {
    id: number,
    fileName: string,
    size: number,
    progress: number,
    code: number,
    file: any
}



type SimpleUploaderType = {
    uploadList: fileListType[]

};
class SimpleUploader extends React.Component<any, SimpleUploaderType> {
    constructor(props: any) {
        super(props);
        this.state = {
            uploadList: []
        };
    }


    componentDidMount() {
        console.log(this.props)
        const _this = this;
        let props = this.props
        const state = this.state


        var uploader = new Uploader({
            target: "http://localhost:9001/updown/upload", //最终口
            query: {
                dateTime: new Date(),
                name: sessionStorage.getItem('username'), // 将存在file对象中的md5数据携带发送过去。
                last_path: this.props.path,
            },
            testChunks: false,
            chunkSize: 500 * 1024 * 1024
        });
        uploader.assignBrowse(document.getElementById('upload'))
        // 文件添加 单个文件
        uploader.on('fileAdded', function (file: any, event: any) {
            console.log(file, event)
        })

        uploader.on("filesSubmitted", files => {
            if (files.length > 0) {
                for (let i in files) {
                    this.state.uploadList.push({
                        id: files[i].id,
                        fileName: files[i].name,
                        size: files[i].getFormatSize(),
                        progress: 0,
                        code: 0,
                        file: files[i]
                    });
                }
                uploader.upload();
            }
        });


        uploader.on("fileProgress", (rootFile: any, file: any) => {

            const newList = this.state.uploadList.map((item: any) => {
                if (item.fileName == file.name) {
                    item.progress = Math.floor(rootFile.progress() * 100);
                }
                return item;
            })
            this.setState({
                uploadList: newList
            })

        });
        // 单个文件上传成功
        uploader.on('fileSuccess', function (rootFile, file, message) {
            console.log(state.uploadList)
            console.log(rootFile, file, message)

            const newList = state.uploadList.map((item: any) => {
                if (rootFile.id === item.id) {
                    item.code = 200
                }
                return item;
            })

            setTimeout(() => {
                props.init(props.path, '')
                _this.setState({
                    uploadList: newList
                })
            }, 1000)

            /*更改数组中的code 更新文件列表 */
        })
        // 根下的单个文件（文件夹）上传完成
        uploader.on('fileComplete', function (rootFile) {
            console.log(rootFile)
            setTimeout(() => {
                props.init(props.path, '')
            }, 1000)
        })
        // 某个文件上传失败了
        uploader.on('fileError', function (rootFile, file, message) {
            console.log(rootFile, file, message)
            Message.error(message)
        })
    }

    stop = (file: any) => {
        file.pause();
    }

    start = (file: any) => {
        file.resume();
    }

    cancel = (file: any) => {
        const oldList = this.state.uploadList
        for (let i in oldList) {
            if (oldList[i].fileName == file.name) {
                oldList.splice(i, 1);
            }
        }

        this.setState({
            uploadList: oldList
        })


        file.cancel();
    }


    render() {

        const progress = (value) => {
            return (
                <Progress percent={value} />

            )
        }

        const renderDo = (rowIndex: Number, colIndex: Number, dataIndex: any) => {
            return (
                <>

                    {dataIndex.code !== 200 ?
                        <div>
                            <Button onClick={() => this.stop(dataIndex.file)}>暂停</Button>
                            <Button onClick={() => this.start(dataIndex.file)}>开始</Button>
                            <Button onClick={() => this.cancel(dataIndex.file)}>取消上传</Button>
                        </div> : '文件上传已完成'
                    }

                </>
            )
        }

        const uploadStatus = (value: number) => {
            return (
                <>
                    {
                        value === 0 ? <div><Icon type="loading" /></div> : <div> <Icon type="success" style={{ color: '#1DC11D', marginRight: '10px' }} /></div>
                    }
                </>
            )
        }

        return (
            <div>
                <Button id='upload' type='primary' style={{ marginBottom: 20 }}>上传</Button>
                <Table
                    dataSource={this.state.uploadList}
                    hasBorder={false}
                >
                    <Table.Column title="文件名" dataIndex="fileName" style={{ width: 150 }} />
                    <Table.Column title="大小" dataIndex="size" style={{ width: 90 }} />
                    <Table.Column title="进度" dataIndex="progress" cell={progress} style={{ width: 300 }} />
                    <Table.Column title="操作" dataIndex="uploadTime"
                        cell={(rowIndex: Number, colIndex: Number, dataIndex: any) =>
                            renderDo(rowIndex, colIndex, dataIndex)}
                    />
                    <Table.Column title="状态" dataIndex="code"
                        cell={uploadStatus}
                    />
                    {/*  */}
                    {/* 多一个图标 来表示状态 上传中 上传成功/失败 */}
                </Table>
            </div>
        );



    }
}

export default SimpleUploader;













