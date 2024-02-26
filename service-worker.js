self.addEventListener('push', function(event) {
  const notificationData = JSON.parse(event.data.text());

  const options = {
    title: notificationData.title,
    body: notificationData.body,
    icon: notificationData.icon,
		image: notificationData.image,
    data: {
      targetUrl: notificationData.data.target_url,
      push_notification_id: notificationData.data.push_notification_id,
      subscription_id: notificationData.data.subscription_id
    }
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
		.then(() => {
      fetch('https://notifstation.com/push_notification_analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          push_notification_analytic: {
            push_notification_id: notificationData.data.push_notification_id,
            push_subscription_id: notificationData.data.subscription_id,
            received: true,
            clicked: false
          }
        })
      });
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  const notification = event.notification;
  const notificationData = notification.data;
  const targetUrl = notificationData.targetUrl;

  event.notification.close();

  if (targetUrl) {
		event.waitUntil(
			fetch('https://notifstation.com/push_notification_analytics', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify({
					push_notification_analytic: {
						push_notification_id: notificationData.push_notification_id,
						push_subscription_id: notificationData.subscription_id,
						received: true,
						clicked: true
					}
				})
			}).then(() => {
				clients.openWindow(targetUrl);
			})
		);
  }
});