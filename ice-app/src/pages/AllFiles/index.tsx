import React from 'react';
import { ResponsiveGrid, Breadcrumb } from '@alifd/next';
// import PageHeader from '@/components/PageHeader';
import FilesTables from './components/FilesTable';


const { Cell } = ResponsiveGrid;

const Person = () => {
    return (
        <ResponsiveGrid gap={20}>
            <Cell colSpan={12}>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item link="#/base/allFiles">文件管理</Breadcrumb.Item>
                    <Breadcrumb.Item link="#/base/allFiles">所有文件</Breadcrumb.Item>
                </Breadcrumb>
            </Cell>

            <Cell colSpan={12}>
                <FilesTables />
            </Cell>
        </ResponsiveGrid>
    );
};

export default Person;
