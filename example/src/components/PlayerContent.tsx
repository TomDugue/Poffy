import { memo } from "react";
import { PlayerController } from "./PlayerController";
import { StateConsumer } from "./StateConsumer";
import styles from "./PlayerContent.module.css";

export const PlayerContent: React.FC<{ access_token: string }> = memo(
  ({ access_token }) => {
    return (
      <div className={styles.root}>
        <div className={styles.playerButtons}>
          <PlayerController />
        </div>
        <div className={styles.stateConsumer}>
          <StateConsumer access_token={access_token} />
        </div>
      </div>
    );
  },
);
