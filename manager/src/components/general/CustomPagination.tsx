import { Pagination } from "react-admin";

export const perPageDefault : number = 20; 

const CustomPagination = (props : any) => {

    return <Pagination rowsPerPageOptions={[20, 50, 100]} {...props} />;
}

export default CustomPagination;