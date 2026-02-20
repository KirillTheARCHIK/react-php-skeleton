import FilesInProgress from "components/Notifications/FilesInProgress";
import { useSelector } from "react-redux";

export default function FilesInProgressContainer() {
  const filesInProgress = useSelector((state) => state.userTasks.active);
  return <FilesInProgress files={filesInProgress} />;
}
