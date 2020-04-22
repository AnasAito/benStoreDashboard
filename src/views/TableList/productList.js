/*!

=========================================================
* Material Dashboard PRO React - v1.7.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import PropTypes from "prop-types";
// react component for creating dynamic tables
import ReactTable from "react-table";
import Close from "@material-ui/icons/Close";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import Assignment from "@material-ui/icons/Assignment";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardHeader from "components/Card/CardHeader.jsx";

import { gql } from "apollo-boost";
import Button from "components/CustomButtons/Button.jsx";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.jsx";
import PublishIcon from "@material-ui/icons/Publish";
import Snackbar from "components/Snackbar/Snackbar";
import EditIcon from "@material-ui/icons/Edit";
import Done from "@material-ui/icons/Done";
import DeleteIcon from "@material-ui/icons/Delete";
import { Mutation } from "@apollo/react-components";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import Modify from "./modify";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  }
};
const Publish = gql`
  mutation updateProduct($id: ID!) {
    updateProduct(where: { id: $id }, data: { published: true }) {
      id
    }
  }
`;
const Deletep = gql`
  mutation updateProduct($id: ID!) {
    updateProduct(where: { id: $id }, data: { published: false }) {
      id
    }
  }
`;
class ProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      visible: false,
      dialog: false,
      id: ""
    };
  }

  componentDidMount() {
    this.setState({
      data: this.props.data.map((prop, key) => {
        return {
          id: key,
          name: prop[1],
          price: prop[2],
          published: prop[3].toString(),
          actions: (
            // we've added some custom button actions
            <div className="actions-right">
              {/* use this button to add a like kind of action */}

              <Button
                justIcon
                round
                simple
                color="info"
                className="like"
                onClick={() => this.setState({ dialog: true, id: prop[0] })}
              >
                <EditIcon />
              </Button>

              <Mutation mutation={Publish}>
                {(mutation, { data }) => (
                  <Button
                    justIcon
                    round
                    simple
                    color="info"
                    className="like"
                    onClick={async () => {
                      await mutation({ variables: { id: prop[0] } }).then(
                        this.setState({ visible: true })
                      );
                    }}
                  >
                    <PublishIcon />
                  </Button>
                )}
              </Mutation>
              {/* use this button to add a edit kind of action */}
              <Mutation mutation={Deletep}>
                {(mutation, { data }) => (
                  <Button
                    justIcon
                    round
                    simple
                    color="warning"
                    className="like"
                    onClick={() => mutation({ variables: { id: prop[0] } })}
                  >
                    <DeleteIcon />
                  </Button>
                )}
              </Mutation>
            </div>
          )
        };
      })
    });
  }
  render() {
    const { classes } = this.props;
    //console.log(this.state.data)
    return (
      <>
        <GridContainer>
          <GridItem xs={12}>
            <Card>
              <CardHeader color="primary" icon>
                <CardIcon color="primary">
                  <Assignment />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Products table</h4>
              </CardHeader>
              <CardBody>
                <ReactTable
                  data={this.state.data}
                  filterable
                  columns={[
                    {
                      Header: "Product Name",
                      accessor: "name"
                    },
                    {
                      Header: "Product Price",
                      accessor: "price"
                    },
                    {
                      Header: "Published",
                      accessor: "published"
                    },

                    {
                      Header: "Actions",
                      accessor: "actions",
                      sortable: false,
                      filterable: false
                    }
                  ]}
                  defaultPageSize={5}
                  showPaginationTop
                  showPaginationBottom={false}
                  className="-striped -highlight"
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <Dialog
          open={this.state.dialog}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.setState({ dialog: false })}
          aria-labelledby="classic-modal-slide-title"
          aria-describedby="classic-modal-slide-description"
          contentStyle={{ width: "100%", maxWidth: "none" }}
        >
          <DialogTitle
            id="classic-modal-slide-title"
            disableTypography
            className={classes.modalHeader}
          >
            <Button
              justIcon
              className={classes.modalCloseButton}
              key="close"
              aria-label="Close"
              color="transparent"
              onClick={() => this.setState({ dialog: false })}
            >
              <Close className={classes.modalClose} />
            </Button>
          </DialogTitle>
          <DialogContent
            id="classic-modal-slide-description"
            className={classes.modalBody}
          >
            <Modify id={this.state.id} refetch={this.props.refetch} />
          </DialogContent>
        </Dialog>
        <Snackbar
          place="tc"
          color={"success"}
          icon={Done}
          message={"product published succesfuly ,reload app to see changes !"}
          open={this.state.visible}
          closeNotification={() => {
            this.setState({ visible: false });
          }}
          close
        />
      </>
    );
  }
}

ProductTable.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(ProductTable);
