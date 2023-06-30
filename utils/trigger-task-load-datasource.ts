// import { Queue } from 'bullmq';
import Redis from "ioredis";

import { TaskQueue } from "@app/types";
import { TaskLoadDatasourceRequestSchema } from "@app/types/dtos";
import { QueuePro } from "@app/utils/bullmq-pro";

  const connection = new Redis({
    username: process.env.REDIS_USERNAME!,
    password: process.env.REDIS_HOST_PASSWORD!,
    host:   process.env.REDIS_HOST!,
    port: Number(process.env.REDIS_PORT!),
  });

const datasourceLoadQueue = new QueuePro(TaskQueue.load_datasource, {
  connection: connection as any,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});
// redis://default:3bdd928c25614f6f8afd8c356e5af101@fly-griotai-redis.upstash.io
const triggerTaskLoadDatasource = async (
  data: {
    userId: string;
    datasourceId: string;
    isUpdateText?: boolean;
    priority?: number;
  }[]
) => {
  return datasourceLoadQueue.addBulk(
    data.map((each) => ({
      name: TaskQueue.load_datasource,
      data: each as TaskLoadDatasourceRequestSchema,
      opts: {
        group: {
          id: each.userId,
        },
        ...(each.priority ? { priority: each.priority } : {}),
      },
    }))
  );
};

export default triggerTaskLoadDatasource;
