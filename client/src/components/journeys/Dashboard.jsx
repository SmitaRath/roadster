import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Box,
  Container,
  Grid,
  ButtonGroup,
  Typography,
  Button,
} from "@material-ui/core";
import { red, orange, green, blue } from "@material-ui/core/colors";
import GetAppIcon from "@material-ui/icons/GetApp";
import EditIcon from "@material-ui/icons/Edit";
import ExploreIcon from "@material-ui/icons/Explore";
import MoneyIcon from "@material-ui/icons/Money";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import InfoCard from "./InfoCard.jsx";
import Members from "./Members";
import Description from "./Description";
import Map from "./Map.jsx";
import TimeLine from "./Timeline.jsx";
import apiService from "../../services/apiService";
import CommentsBox from "./CommentsBox";

const Dashboard = () => {
  const { id } = useParams();
  const [journey, setJourney] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [routeProperty, setRouteProperty] = useState({
    totalDist: 0,
    totalTime: 0,
  });

  useEffect(() => {
    async function fetchJourney() {
      let data = await apiService.getResource(`journeys/${id}`);
      setJourney(data);
      setLoading(false);
    }
    fetchJourney();
  }, [id]);

  const setDistanceTime = (data) => {
    setRouteProperty(data);
  };

  const generatePdf = () => {
    html2canvas(document.getElementById("journeyDash"), {
      proxy: "server.js",
      useCORS: true,
    }).then(function (canvas) {
      let doc;
      var imgData = canvas.toDataURL("image/jpeg");
      var w = document.getElementById("journeyDash").offsetWidth;
      var h = document.getElementById("journeyDash").offsetHeight;
      doc = new jsPDF("l", "mm", [canvas.height, canvas.width]);
      doc.addImage(imgData, "JPEG", 0, 0, w, h);
      doc.save("Journey_" + id + ".pdf");
    });
  };

  if (loading) {
    return "Loading";
  } else {
    return (
      <div>
        <Helmet>
          <title>Roadster | Journey Dashboard</title>
        </Helmet>
        <Box
          sx={{
            backgroundColor: "background.default",
            minHeight: "100%",
            py: 3,
          }}
        >
          <Container maxWidth="lg">
            <br />
            <Grid container direction="row" spacing={5}>
              <Grid item lg={7} sm={6}>
                <Typography component="h2" variant="h5">
                  Roadtrip | {journey.name}
                </Typography>
              </Grid>
              <Grid container justify="flex-end" item lg={5} sm={6}>
                <ButtonGroup
                  variant="text"
                  aria-label="text primary button group"
                >
                  <Button
                    onClick={generatePdf}
                    color="primary"
                    variant="outlined"
                  >
                    <EditIcon />
                    Edit
                  </Button>
                  <Button onClick={generatePdf} variant="outlined">
                    <DeleteOutlineIcon />
                    Delete
                  </Button>
                  <Button
                    onClick={generatePdf}
                    color="primary"
                    variant="outlined"
                  >
                    <GetAppIcon />
                    Download Journey
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid>
            <br />
            <br />
            <br />
            <Grid id="journeyDash" container spacing={3}>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <InfoCard
                  title="Total Distance"
                  value={routeProperty.totalDist}
                  icon={<ExploreIcon />}
                  color={orange}
                />
              </Grid>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <InfoCard
                  title="Total Time"
                  value={routeProperty.totalTime}
                  icon={<AccessTimeIcon />}
                  color={red}
                />
              </Grid>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <InfoCard
                  title="Members"
                  value={journey.occupancy}
                  icon={<PeopleOutlineIcon />}
                  color={green}
                />
              </Grid>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <InfoCard
                  title="Tentative Budget"
                  value={"$" + journey.budget}
                  icon={<MoneyIcon />}
                  color={blue}
                />
              </Grid>
              <Grid item lg={8} md={12} xl={9} xs={12}>
                <Map journey={journey} setDistanceTime={setDistanceTime} />
              </Grid>
              <Grid item lg={4} md={6} xl={3} xs={12}>
                <TimeLine journey={journey} />
              </Grid>
              <Grid item lg={4} md={6} xl={3} xs={12}>
                <Members journey={journey} />
              </Grid>
              <Grid item lg={8} md={12} xl={9} xs={12}>
                <Description journey={journey} />
              </Grid>
              <Grid item lg={4} md={6} xl={3} xs={12}>
                <CommentsBox journey={journey} />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </div>
    );
  }
};

export default Dashboard;
