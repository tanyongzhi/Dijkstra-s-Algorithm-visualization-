// import React from 'react';
// import PropTypes from "prop-types";
// import { makeStyles } from '@material-ui/core/styles';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import Paper from '@material-ui/core/Paper';

// const useStyles = makeStyles({
//   table: {
//     minWidth: 650,
//   },
// });
// function createData(name, calories, fat, carbs, protein) {
//   return { name, calories, fat, carbs, protein };
// }

// const rows = [
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
// ];

// export default class TestTable extends React.Component {
//     static propTypes = {
//         nodes: PropTypes.instanceOf(Array).isRequired
//     }
//     constructor(props){
//         super(props);
//     }
//     render(){
//         return (
//             <TableContainer component={Paper}>
//               <Table className= "table_style" aria-label="simple table">
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Node </TableCell>
//                     <TableCell align="right">Current Cost</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {/* {this.props.nodes[0].map(row => (
//                     <TableRow key={1}>
//                       <TableCell component="th" scope="row">
//                         {row.distance}
//                       </TableCell>
//                       <TableCell align="right">{row.nodeId}</TableCell>
//                     </TableRow>
//                   ))} */}
//                   {
//                       this.props.nodes[0].map(row => (
//                         <TableRow>
//                         <TableCell component = "th" scope = "row">
//                             {row.nodeId}
//                         </TableCell>
//                         <TableCell align = "right">
//                             {row.distance}
//                         </TableCell>
//                     </TableRow>
//                       ))
//                   }

//                 </TableBody>
//               </Table>
//             </TableContainer>
//           );
//     }
// }
