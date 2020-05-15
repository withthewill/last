import React from 'react';
import { ResponsiveGrid } from '@alifd/next';
// import PageHeader from '@/components/PageHeader';
import SimpleUploader from './components/SimpleUploader';


const { Cell } = ResponsiveGrid;

const Person = (props) => {
    return (
        <ResponsiveGrid gap={20}>
            <Cell colSpan={12}>
                <SimpleUploader path={props.path} init={()=>props.init(props.path,'')}/>
            </Cell>
        </ResponsiveGrid>
    );
};

export default Person;
