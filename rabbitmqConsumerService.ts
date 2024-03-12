import amqp from 'amqplib';
import { recordSpin } from './services/sequelizeService';

async function startConsumerService() {
  try {
  
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const queue = 'addSpins';
    await channel.assertQueue(queue, { durable: true });

    channel.prefetch(1);

    console.log('Waiting for spin data in the queue...');

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const spinData = JSON.parse(msg.content.toString());
        console.log('Received spin data:', spinData);

        try {
          const [affectedCount, updatedUsers] = await recordSpin(spinData);
          if (affectedCount > 0) {
            console.log('Spin data updated successfully:', updatedUsers[0]);
          } else {
            console.log('User not found for spin data:', spinData);
          }
        } catch (error) {
          console.error('Error processing spin data:', error);
        } finally {
          channel.ack(msg);
        }
      }
    });
  } catch (error) {
    console.error('Error starting RabbitMQ consumer service:', error);
  }
}

startConsumerService();